import {useState} from "react";
import {Bell, CalendarDays, CheckCheck} from "lucide-react";

const initialNotifications = [
    {
        id: 1,
        title: "New manpower request",
        message: "A new manpower request is awaiting review.",
        time: "Just now",
        unread: true,
    },
    {
        id: 2,
        title: "New applicant",
        message: "A new applicant has submitted an application.",
        time: "10 minutes ago",
        unread: true,
    },
    {
        id: 3,
        title: "Job opening reminder",
        message: "Review your published job openings and deadlines.",
        time: "1 hour ago",
        unread: false,
    },
];

const AdminTopbar = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter((notification) => notification.unread).length;

    const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            }))
        );
    };

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) => (notification.id === id ? {...notification, unread: false} : notification))
        );
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-h-12 items-center justify-between gap-4">
                {/* Today's Date */}
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-950">
                        <CalendarDays size={22} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500 sm:text-sm">Today's Date</p>
                        <p className="text-sm font-bold text-slate-900 sm:text-base">{today}</p>
                    </div>
                </div>

                {/* Notification Bell */}
                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-label="Toggle notifications"
                        aria-expanded={isOpen}
                        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-blue-950"
                    >
                        <Bell size={21} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <>
                            <button
                                type="button"
                                aria-label="Close notifications"
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 z-40 cursor-default"
                            />

                            <div className="absolute right-0 top-14 z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                                        <p className="text-xs text-slate-500">
                                            {unreadCount} unread notification
                                            {unreadCount === 1 ? "" : "s"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-950 hover:text-blue-700"
                                    >
                                        <CheckCheck size={15} />
                                        Mark all read
                                    </button>
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <button
                                                key={notification.id}
                                                type="button"
                                                onClick={() => markAsRead(notification.id)}
                                                className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                                                    notification.unread ? "bg-blue-50/60" : "bg-white"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span
                                                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                            notification.unread ? "bg-blue-950" : "bg-transparent"
                                                        }`}
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {notification.title}
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            {notification.message}
                                                        </p>
                                                        <p className="mt-2 text-[11px] text-slate-400">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-4 py-8 text-center text-sm text-slate-500">
                                            No notifications yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
