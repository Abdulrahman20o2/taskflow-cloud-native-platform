
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  Cloud,
  Bell,
  User,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: Activity,
  },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-100 lg:flex">

      {/* Sidebar */}
      <aside className="w-full border-b border-gray-800 bg-[#111827] lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
          <div className="rounded-lg bg-blue-600 p-2">
            <Cloud size={22} />
          </div>

          <span className="text-xl font-bold tracking-wide">
            TaskFlow
          </span>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 lg:flex-col">
          <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 lg:block">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden border-t border-gray-800 p-4 lg:mt-8 lg:block">
          <div className="flex items-center gap-3 rounded-lg bg-gray-800/60 p-3">
            <div className="rounded-full bg-gray-700 p-2">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.full_name}
              </p>
              <p className="truncate text-xs text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-[#111827]/80 px-5 lg:px-8">
          <div>
            <p className="text-sm text-gray-400">
              Welcome back,
              <span className="ml-1 font-semibold text-white">
                {user?.full_name}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 lg:hidden"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}