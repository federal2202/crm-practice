import { requireUser } from "../lib/hooks";

export default async function DashboardPage(){
    const session = await requireUser()

    return (
        <h1>hello from the dashboard</h1>
    )
}