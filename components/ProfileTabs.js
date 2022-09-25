import { useRouter } from "next/router";
import { classNames } from "../utils/helpers";

export default function ProfileTabs({ lensHandle, currentTabName }) {
  const tabs = [
    {
      name: "Homebase",
      href: `/homebase/${lensHandle}`,
      current: currentTabName === "Homebase",
    },
    {
      name: "Memberships",
      href: `/homebase/${lensHandle}/locks`,
      current: currentTabName === "Memberships",
    },
  ];

  const router = useRouter();

  const handleChange = (e) => {
    e.preventDefault();
    console.log("handleChange", e.target.value);
    router.push(e.target.value);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-stone-300 py-2 pl-3 pr-10 text-base focus:border-emerald-600 focus:outline-none focus:ring-emerald-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current).href}
          onChange={handleChange}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-stone-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300",
                  "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
