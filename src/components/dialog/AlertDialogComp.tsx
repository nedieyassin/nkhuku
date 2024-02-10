import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {DialogComponent} from "react-dialog-promise";

interface Props {
    title: string
    description?: string
}

type Result = boolean

const AlertDialogComp: DialogComponent<Props, Result> = ({isOpen, close, title, description}) => {
    return <AlertDialog open={isOpen} onOpenChange={(val) => close(val)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => close(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => close(true)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}

export default AlertDialogComp