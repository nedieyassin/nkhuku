import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Icon} from "@iconify/react";
import {Button} from "@/components/ui/button.tsx";
import useStore from "@/state";
import {useNavigate} from "react-router-dom";

export default function AppbarActions() {
    const {currentUser, setCurrentUser} = useStore((state) => state);
    const navigate = useNavigate();
    const handleLogout = () => {
        setCurrentUser(undefined);
        localStorage.removeItem('pocketbase_auth');
        navigate('/login');

    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0">
                        <Icon icon={'lucide:user'} className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-2">
                    <DropdownMenuLabel>{currentUser?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Icon icon={'lucide:user'} className="mr-2 h-4 w-4"/>
                            <span>Profile</span>
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Icon icon={'lucide:settings'} className="mr-2 h-4 w-4"/>
                            <span>Settings</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <Icon icon={'lucide:life-buoy'} className="mr-2 h-4 w-4"/>
                        <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleLogout}>
                        <Icon icon={'lucide:logout'} className="mr-2 h-4 w-4"/>
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}