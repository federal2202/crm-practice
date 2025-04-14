import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { requireUser } from "../lib/hooks";
import EmptyState from "../components/EmptyState";

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
                <p>hey we have event types</p>
            )}
        </div>
    )
}