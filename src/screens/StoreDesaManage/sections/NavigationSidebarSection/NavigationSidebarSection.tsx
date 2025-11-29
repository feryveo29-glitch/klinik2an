import React from "react";
import { Button } from "../../../../components/ui/button";

const dailyUseItems = [
  {
    icon: "/iconsax-linear-chart2.svg",
    label: "Overview",
  },
  {
    icon: "/iconsax-linear-profiletick.svg",
    label: "People",
  },
  {
    icon: "/iconsax-linear-crown1.svg",
    label: "Live Events",
  },
  {
    icon: "/iconsax-linear-shoppingcart.svg",
    label: "Transactions",
  },
];

const economyItems = [
  {
    icon: "/iconsax-linear-building3.svg",
    label: "Stores",
    isActive: true,
  },
  {
    icon: "/iconsax-linear-transactionminus.svg",
    label: "Products",
    isActive: false,
  },
  {
    icon: "/iconsax-linear-receiptedit.svg",
    label: "Legals",
    isActive: false,
  },
];

const settingsItems = [
  {
    icon: "/iconsax-linear-setting2.svg",
    label: "Settings",
  },
  {
    icon: "/iconsax-linear-logout.svg",
    label: "Sign Out",
  },
];

export const NavigationSidebarSection = (): JSX.Element => {
  return (
    <aside className="w-[250px] h-full bg-white border-r border-softgrey-2">
      <div className="flex flex-col h-full">
        <div className="pt-[45px] pb-[50px] px-6">
          <img
            className="w-[155px] h-10 object-cover"
            alt="Logo dewata"
            src="/logo-dewata-1.png"
          />
        </div>

        <nav className="flex-1 px-6 space-y-10">
          <div className="space-y-[18px]">
            <h3 className="[font-family:'Poppins',Helvetica] font-normal text-softgreymetalic-3 text-sm tracking-[0] leading-normal">
              Daily Use
            </h3>
            <div className="space-y-7">
              {dailyUseItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-6 px-0 hover:bg-transparent"
                >
                  <img className="w-6 h-6" alt={item.label} src={item.icon} />
                  <span className="[font-family:'Poppins',Helvetica] font-medium text-softgreymetalic-3 text-base tracking-[0] leading-normal">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="[font-family:'Poppins',Helvetica] font-normal text-softgreymetalic-3 text-sm tracking-[0] leading-normal">
              Economy
            </h3>
            <div className="space-y-5">
              {economyItems.map((item, index) => (
                <div key={index} className="relative">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-8 px-0 hover:bg-transparent"
                  >
                    <img className="w-6 h-6" alt={item.label} src={item.icon} />
                    <span
                      className={`[font-family:'Poppins',Helvetica] ${
                        item.isActive
                          ? "font-semibold text-purple"
                          : "font-medium text-softgreymetalic-3"
                      } text-base tracking-[0] leading-normal`}
                    >
                      {item.label}
                    </span>
                  </Button>
                  {item.isActive && (
                    <div className="absolute right-0 top-0 w-0.5 h-8 bg-purple rounded-[50px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[19px]">
            <h3 className="[font-family:'Poppins',Helvetica] font-normal text-softgreymetalic-3 text-sm tracking-[0] leading-normal">
              Settings
            </h3>
            <div className="space-y-12">
              {settingsItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-6 px-0 hover:bg-transparent"
                >
                  <img className="w-6 h-6" alt={item.label} src={item.icon} />
                  <span className="[font-family:'Poppins',Helvetica] font-medium text-softgreymetalic-3 text-base tracking-[0] leading-normal">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};
