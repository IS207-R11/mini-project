import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-6xl font-black text-emerald-600 dark:text-emerald-400">404</h2>
      <p className="mt-4 text-xl font-medium text-foreground">
        Không tìm thấy trang yêu cầu
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-transform hover:scale-105"
      >
        Trở về Trang chủ
      </Link>
    </div>
  );
}
