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
import queryString from 'query-string'


const formSchema = z.object({
    fileUrl: z.string().min(
        1, {
        message: "Attachment is required."
    }
    ),

})

export default function MessageFileModal() {

    const router = useRouter()
    const { isOpen, onClose, type, data } = useModal()
    const { apiUrl, query } = data

    const isModalOpen = isOpen && type === 'messageFile'


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: '',
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const url = queryString.stringifyUrl({
                url: apiUrl || '',
                query,
            })

            await axios.post(url, { ...values, content: values.fileUrl });
            form.reset()
            router.refresh()
            onClose()
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
                        Attach the file here
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
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

                        </div>
                            <DialogFooter className='bg-gray-100 px-6 py-4'>
                                <Button variant="primary" disabled={isLoading}>
                                    Send
                                </Button>
                            </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}