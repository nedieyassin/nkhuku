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
import {Link} from "react-router-dom";

const formSchema = z.object({
    username: z.string().email().trim().toLowerCase(),
    password: z.string().min(8),
})

export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
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
                                        <Input placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage className={'text-xs'}/>
                                </FormItem>
                            )}
                        />
                        {/**/}
                        <Button type="submit" className={'w-full'}>Login</Button>
                        <div>
                            <p className={'text-center text-sm'}>Don't have an account? <Link
                                to={'/register'} className={'text-blue-500'}>Register</Link></p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}