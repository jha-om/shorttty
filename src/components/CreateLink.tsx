import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import QrCode from "./QrCode";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

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
    // const { user, error: authError, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const longUrl = searchParams.get("createNew");

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [formValues, setFormValues] = useState<FormData>({
        title: "",
        longUrl: longUrl ?? "",
        customUrl: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <Dialog
            defaultOpen={!!longUrl}
            onOpenChange={(res) => {
                if (!res) {
                    setSearchParams({})
                }
            }}
        >
            <DialogTrigger>
                <Button variant={"ghost"}>Create New Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Short URL</DialogTitle>
                    <DialogDescription>
                        Create a new short URL to share it with anyone
                    </DialogDescription>
                </DialogHeader>
                {formValues.longUrl && !errors.longUrl && (
                    <div className="flex justify-center py-4">
                        <QrCode
                            value={formValues.longUrl}
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
                        // onClick={}
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