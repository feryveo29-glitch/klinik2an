import { SearchIcon } from "lucide-react";
import React from "react";
import { Input } from "../../components/ui/input";
import { AddNewTransactionSection } from "./sections/AddNewTransactionSection";
import { NavigationSidebarSection } from "./sections/NavigationSidebarSection";
import { TransactionFormSection } from "./sections/TransactionFormSection";

export const StoreDesaManage = (): JSX.Element => {
  return (
    <div className="flex bg-bgprimary">
      <NavigationSidebarSection />

      <div className="flex-1 flex flex-col ml-[250px]">
        <header className="h-[110px] bg-white border-b border-[#eceef2] flex items-center justify-between px-[50px]">
          <div className="relative w-[450px]">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-softgreymetalic-3" />
            <Input
              type="text"
              placeholder="SearchIcon data by anggota, store, or event"
              className="w-full h-[55px] pl-14 pr-5 bg-bgprimary rounded-[50px] border-0 text-base font-normal text-softgreymetalic-3 placeholder:text-softgreymetalic-3 [font-family:'Poppins',Helvetica]"
            />
          </div>

          <div className="flex items-center gap-4">
            <img
              className="w-[143px] h-[55px]"
              alt="Group"
              src="/group-12.png"
            />
          </div>
        </header>

        <main className="flex-1">
          <AddNewTransactionSection />
          <TransactionFormSection />
        </main>
      </div>
    </div>
  );
};
