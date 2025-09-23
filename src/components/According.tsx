import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionComponent() {
    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger  className="cursor-pointer hover:no-underline">How does the shorttty the URL works?</AccordionTrigger>
                <AccordionContent className="text-base">
                    After entering a long URL, our system generates a shorter version of that URL, that redirects to the original URL.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger  className="cursor-pointer hover:no-underline">Do I need to signup before using shorttty?</AccordionTrigger>
                <AccordionContent className="text-base">
                    Yes. Creating an account allows you to manage your all URL's, view analytics, and customize your shortty URLs.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger  className="cursor-pointer hover:no-underline">What analytics are available for the shorttty URLs?</AccordionTrigger>
                <AccordionContent className="text-base">
                    You can view the number of clicks, geolocation data of the clicks and device types(mobile/desktop) for each of the shorttty URLs created.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}