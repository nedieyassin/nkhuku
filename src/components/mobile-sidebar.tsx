import {Sheet, SheetContent} from "@/components/ui/sheet.tsx";
import Sidebar from "@/components/sidebar.tsx";

interface Props {
    open: boolean
    onOpenChange: (flag: boolean) => void
}

export default function MobileSidebar({open, onOpenChange}: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side='left' className='w-[240px] p-0' showClose={false}>
                <Sidebar onClick={() => onOpenChange(false)}/>
            </SheetContent>
        </Sheet>
    )
}