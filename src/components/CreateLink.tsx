import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { createUrl } from "@/utils/api-urls";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import QrCode, { type QrCodeRef } from "./QrCode";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import useDebounce from "@/hooks/use-debounce";

const FormValidation = z.object({
    title: z.string().min(3, "Title is required & must be atleast 3 characters"),
    longUrl: z.string().min(1, "URL is required").url("Must be a valid URL"),
    customUrl: z.string().max(8, "must be less than or equal to 8 characters").optional().refine(
        (val) => !val || /^[a-zA-Z0-9]+$/.test(val),
        "Custom URL can only contain letters, numbers"
    )
});

type FormData = z.infer<typeof FormValidation>;

export default function CreateLink() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const longUrl = searchParams.get("createNew");
    const ref = useRef<QrCodeRef>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [formValues, setFormValues] = useState<FormData>({
        title: "",
        longUrl: longUrl ?? "",
        customUrl: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [urlPreview, setUrlPreview] = useState<string>("");

    // use debouncing to delay the network request after {delay} seconds;
    const debouncedFormValues = useDebounce(formValues, 2000)
    const debouncedLongUrl = useDebounce(formValues.longUrl, 2000)

    useEffect(() => {
        if (debouncedLongUrl && debouncedLongUrl.trim()) {
            try {
                new URL(debouncedLongUrl);
                setUrlPreview(debouncedLongUrl);
            } catch {
                setUrlPreview("");
            }
        } else {
            setUrlPreview("");
        }
    }, [debouncedLongUrl]);

    useEffect(() => {
        if (debouncedFormValues.longUrl) {
            const validation = FormValidation.safeParse(debouncedFormValues);
            if (!validation.success) {
                const fieldErrors: Partial<Record<keyof FormData, string>> = {};
                validation.error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof FormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                setErrors({});
            }
        }
    }, [debouncedFormValues]);

    // handling input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }

    const handleSubmit = async () => {
        try {
            setErrors({});
            const validatingData = FormValidation.safeParse(formValues);
            if (!validatingData.success) {
                const fieldErrors: Partial<Record<keyof FormData, string>> = {};
                validatingData.error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof FormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
                return;
            }
            setIsSubmitting(true);

            let qrCodeBlob: Blob | null = null;

            if (ref.current) {
                qrCodeBlob = await ref.current.getQRCodeBlob();
            }

            if (!qrCodeBlob) {
                throw new Error("failed to generate QR Code");
            }

            const qrCodeFile = new File([qrCodeBlob], 'qr-code.png')

            const response = await createUrl({
                ...validatingData.data,
                customUrl: validatingData.data.customUrl || "",
                user_id: user?.id as string,
                qrcode: qrCodeFile,
            })

            setSearchParams({});

            if (response && response[0].id) {
                navigate(`/link/${response[0].id}`);
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<Record<keyof FormData, string>> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof FormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                console.error("Error creating URL: ", error);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog
            defaultOpen={!!longUrl}
            onOpenChange={(res) => {
                if (!res) {
                    setSearchParams({})
                }
            }}
        >
            <DialogTrigger>Create New Link</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Short URL</DialogTitle>
                    <DialogDescription>
                        Create a new short URL to share it with anyone
                    </DialogDescription>
                </DialogHeader>
                
                {urlPreview && !errors.longUrl && (
                    <div className="flex justify-center py-4">
                        <QrCode
                            ref={ref}
                            value={urlPreview} // ✅ Uses debounced URL
                            size={180}
                            bgColor="#ffffff"
                        />
                    </div>
                )}
                
                <div className="space-y-4">
                    {/* title */}
                    <div>
                        <Input

                            placeholder="Short Link's Title"
                            value={formValues.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {/* error message todo: */}
                        {errors.title && (
                            <p className="mt-1 border-red-500 text-sm">{errors.title}</p>
                        )}
                    </div>

                    {/* long url input */}
                    <div>
                        <Input
                            placeholder="Enter your Long ass URL"
                            value={formValues.longUrl}
                            onChange={(e) => handleInputChange("longUrl", e.target.value)}
                            className={errors.longUrl ? "border-red-500" : ""}
                        />
                        {/* error message todo: */}
                        {errors.longUrl && (
                            <p className="mt-1 text-red-500 text-sm">{errors.longUrl}</p>
                        )}

                        {formValues.longUrl !== debouncedLongUrl && formValues.longUrl && (
                            <p className="text-xs text-gray-500 mt-1">
                                ⏳ Generating QR code...
                            </p>
                        )}
                    </div>
                    {/* custom url input */}
                    <div>
                        <div className="flex items-center gap-2">
                            <Card className="p-2 text-sm">shorttty.vercel.app/</Card>
                            <Input
                                placeholder="Custom Link(optional)"
                                value={formValues.customUrl}
                                onChange={(e) => handleInputChange('customUrl', e.target.value)}
                                className={errors.customUrl ? "border-red-500" : ""}
                            />
                        </div>
                        {/* error message todo: */}
                        {errors.customUrl && (
                            <p className="mt-1 text-red-500 text-sm">{errors.customUrl}</p>
                        )}
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Creating..." : "Create Short URL"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}