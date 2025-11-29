import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

export const AddNewTransactionSection = (): JSX.Element => {
  const breadcrumbItems = [
    { label: "Store", isLink: true },
    { label: "Ceria Mart", isLink: true },
    { label: "Add New Transactions", isLink: false },
  ];

  return (
    <div className="w-full flex flex-col gap-0">
      <h1 className="[font-family:'Poppins',Helvetica] font-bold text-[#222222] text-[38px] tracking-[0] leading-[normal]">
        Add New
      </h1>

      <Breadcrumb>
        <BreadcrumbList className="[font-family:'Poppins',Helvetica] font-normal text-base tracking-[0] leading-[normal]">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isLink ? (
                  <BreadcrumbLink className="text-[#a1a4ac] hover:text-[#a1a4ac]">
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <span className="font-semibold text-[#222222]">
                    {item.label}
                  </span>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator className="text-[#a1a4ac]" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
