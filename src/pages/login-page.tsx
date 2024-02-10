import {Icon} from "@iconify/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {queryStringToObject} from "@/lib/utils.ts";
import pb from "@/lib/pocketbase.ts";
import {useState} from "react";
import {toast} from "sonner"
import useStore from "@/state";

const formSchema = z.object({
    username: z.string().email().trim().toLowerCase(),
    password: z.string().min(8),
})

export default function LoginPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: queryStringToObject(location.search).email ?? "",
            password: "",
        },
    })

    const [isLoading, setIsLoading] = useState(false);
    const {currentUser, setCurrentUser} = useStore((state) => state);

    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true)
        pb.collection('users').authWithPassword(
            form.username,
            form.password,
        ).then((res) => {
            setCurrentUser(res.record);
            navigate('/dashboard')
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
            console.log({...err})
            toast.error("Something went wrong", {
                description: err?.response?.message ?? "Please try again",
            })
        });
    }


    return (
        <div className={'w-full flex-col min-h-screen flex items-center justify-center px-4'}>

            <div className={'space-y-2'}>
                <Link to={'/'} className={'flex flex-col items-center justify-center gap-1'}>
                    <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-10 w-10'}/>
                    <h1 className={'text-2xl font-bold'}>NKHUKU</h1>
                </Link>
                <div>
                    <h2 className={'font-semibold text-center text-xl'}>Login to your account</h2>
                </div>
            </div>
            {currentUser ? (
                <div className={'py-4 w-full md:max-w-96'}>
                    <div className={'space-y-4'}>
                        <Button className={'w-full'} onClick={() => navigate('/dashboard')}>
                            Continue as <span className={'font-bold inline-block pl-2 '}>{currentUser.name}</span>
                        </Button>
                        <Button onClick={() => setCurrentUser(undefined)} className={'w-full'} variant={'outline'}>Use
                            another
                            account</Button>
                    </div>
                </div>
            ) : (
                <div className={'py-4 w-full md:max-w-96'}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/**/}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage className={'text-xs'}/>
                                    </FormItem>
                                )}
                            />
                            {/**/}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type={'password'} placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage className={'text-xs'}/>
                                    </FormItem>
                                )}
                            />
                            {/**/}
                            <Button type="submit" className={'w-full'} disabled={isLoading}>
                                {isLoading && <Icon icon={'eos-icons:loading'} className={'h-5 w-5 mr-1'}/>} Login to
                                your
                                account
                            </Button>
                            <div>
                                <p className={'text-center text-sm'}>Don't have an account? <Link
                                    to={'/register'} className={'text-blue-500 hover:underline'}>Register</Link></p>
                            </div>
                        </form>
                    </Form>
                </div>)
            }
        </div>
    )
}