import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { requireUser } from "../lib/hooks";
import EmptyState from "../components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLinkIcon, Link2, Pen, Settings, Trash, Users2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

async function getData(userId: string){
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            userName: true,
            eventType: {
                select: {
                    id: true,
                    active: true,
                    title: true,
                    url: true,
                    duration: true,
                },
            },
        },
    });
    if(!data){
        return notFound()
    }

    return data;
}

export default async function DashboardPage(){
    const session = await requireUser()
    const data = await getData(session.user?.id as string)

    return (
        <div>
            {data.eventType.length === 0 ? (
                <EmptyState title="you have no Event Types" description="Ypu can create one by clicking the button below" buttonText="Add event type" href="/dashboard/new"/>
            ): (
                <>
                    <div className="flex items-center justify-between px-2 mb-4">
                        <div className="hidden sm:grid gap-y-1">
                            <h1 className="text-3xl md:text-4xl font-semibold">Event Types</h1>
                            <p className="text-muted-foreground">Create and manage your event types right here.</p>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/new">
                                Create New Event
                            </Link>
                        </Button>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {data.eventType.map((item) => (
                            <div key={item.id} className="overflow-hidden shadow rounded-lg border relative">
                                <div className="absolute top-2 right-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <Settings className="size-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Event</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/${data.userName}/${item.url}`}>
                                                        <ExternalLinkIcon className="mr-2 size-4"/>
                                                        <span>Preview</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/">
                                                        <Link2 className="mr-2 size-4"/>
                                                        <span>Copy</span>
                                                    </Link>
                                                    
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/">
                                                        <Pen className="size-4 mr-2 "/>
                                                        <span>Edit</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/">
                                                    <Trash className="size-4 mr-2"/>
                                                    <span>Delete</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <Link href="/" className="flex items-center p-5">
                                    <div className="flex-shrink-0">
                                        <Users2 className="size-6"/>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                {item.duration} Minutes Meeting
                                            </dt>
                                            <dd className="text-lg font-medium">
                                                {item.title}
                                            </dd>
                                        </dl>
                                    </div>
                                </Link>
                                <div className="bg-muted px-5 py-3 justify-between items-center flex">
                                    <Switch />
                                    <Button>
                                        Edit Event
                                    </Button>

                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}