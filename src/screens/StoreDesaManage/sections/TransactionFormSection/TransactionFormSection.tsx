import { ShoppingCartIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const formFields = [
  {
    id: "product",
    label: "Product",
    type: "select",
    placeholder: "Select product e.g Pizza Boy",
    options: [],
  },
  {
    id: "quantity",
    label: "Quantity",
    type: "input",
    placeholder: "e.g 18",
  },
  {
    id: "totalPrice",
    label: "Total Price (in $)",
    type: "input",
    placeholder: "Type the total",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status available",
    options: [],
  },
];

export const TransactionFormSection = (): JSX.Element => {
  return (
    <section className="inline-flex flex-col items-start gap-5">
      {formFields.map((field) => (
        <div
          key={field.id}
          className="flex flex-col gap-2 w-full max-w-[450px]"
        >
          <Label
            htmlFor={field.id}
            className="[font-family:'Poppins',Helvetica] font-semibold text-[#222222] text-base"
          >
            {field.label}
          </Label>
          {field.type === "select" ? (
            <Select>
              <SelectTrigger
                id={field.id}
                className="h-[55px] bg-white rounded-[50px] border border-solid border-[#eceef2] [font-family:'Poppins',Helvetica] font-normal text-[#a1a4ac] text-base px-4"
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              className="h-[55px] bg-white rounded-[50px] border border-solid border-[#eceef2] [font-family:'Poppins',Helvetica] font-normal text-[#a1a4ac] text-base px-4"
            />
          )}
        </div>
      ))}

      <Button className="w-full max-w-[450px] h-[55px] bg-purple hover:bg-purple/90 rounded-[50px] [font-family:'Poppins',Helvetica] font-semibold text-white text-base">
        <ShoppingCartIcon className="w-6 h-6 mr-2" />
        Save Transaction
      </Button>
    </section>
  );
};
