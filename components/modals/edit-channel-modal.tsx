"use client"

import axios from 'axios'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { useParams, useRouter } from 'next/navigation'

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
import { ChannelType } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import queryString from 'query-string'
import { useEffect } from 'react'


const formSchema = z.object({
    name: z.string().min(
        1, {
        message: "Channel name is required."
    }).refine(
        name => name !== 'general',
        {
            message: "Channel name cannot be 'general'"
        }
    ),
    type: z.nativeEnum(ChannelType)
})

export default function EditChannelModal() {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const params = useParams()

    const isModalOpen = isOpen && type === 'editChannel'
    const {channel, server} = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.Text
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const url = queryString.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.patch(url, values);
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


    useEffect(
        () => {
            if(channel){
                form.setValue('name', channel.name)
                form.setValue('type', channel.type)
            }
        }, [form, channel]
    )

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className='uppercase text-xs font-bold text-zinc-500'
                                            >
                                                Channel Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offsett-0"
                                                    placeholder="Enter channel name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />

                                        </FormItem>
                                    )
                                }
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Channel Type
                                            </FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className='bg-zinc-300/50 border-0 focis:ring-0 text-black ring-offset-0
                                                focus:ring-offset-0 capitalize outline-none'>
                                                        <SelectValue placeholder='Select a channel type' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(ChannelType).map(
                                                        (type) => (
                                                            <SelectItem key={type} value={type} className='capitalize'>
                                                                {type.toLowerCase()}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )
                                }
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant="primary" disabled={isLoading}>
                                create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}