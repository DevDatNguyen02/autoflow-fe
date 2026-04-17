import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {session?.user?.email}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              Sign Out
            </button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Total Tracking Events</h2>
            <p className="mt-2 text-3xl font-bold text-indigo-600">Verified</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Active Profiles</h2>
            <p className="mt-2 text-3xl font-bold text-green-600">Active</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">AI Tokens Used</h2>
            <p className="mt-2 text-3xl font-bold text-orange-600">Phase 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
