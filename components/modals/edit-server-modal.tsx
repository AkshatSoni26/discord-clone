"use client"

import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FileUplaod from './file-upload'
import { FRONTEND_ROUTES } from '../../urls/URL';
import { useModal } from '../../hooks/use-model-store'
import { useEffect } from 'react'


const formSchema = z.object({
    name: z.string().min(
        1, {
        message: "Server name is required."
    }
    ),
    imageurl: z.string().min(
        1, {
        message: "Server image is required."
    }
    ),

})

export default function EditServerModal() {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'editServer'
    const { server } = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageurl: '',
        }
    })


    useEffect(
        () => {
            if (server) {
                form.setValue("name", server.name)
                form.setValue("imageurl", server.imageurl)
            }
        }, [server, form]
    )

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(FRONTEND_ROUTES.API_SERVER + '/' + server?.id, values);
            form.reset()
            router.refresh()
            onClose();
        }
        catch (error) {
            console.log("error===>", error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        customize your server
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        give your server a presonality with a name  and an image.
                        You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='imageurl'
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUplaod
                                                        endpoint='serverImage'
                                                        value={field.value}
                                                        onChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='name'
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className='uppercase text-xs font-bold text-zinc-500'
                                            >
                                                Server Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offsett-0"
                                                    placeholder="Enter server name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <DialogFooter className='bg-gray-100 px-6 py-4'>
                                                <Button variant="primary" disabled={isLoading}>
                                                    Save
                                                </Button>
                                            </DialogFooter>
                                        </FormItem>
                                    )
                                }
                            />
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}