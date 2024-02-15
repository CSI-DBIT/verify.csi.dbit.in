import { Button } from "@/components/ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import { FC } from "react";
import DeleteTableView from "./manage-delete-components/TableView";
interface ManageDeleteProps {
  delMemberTabledata: MemberDetailsSchema[];
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
const ManageDelete: FC<ManageDeleteProps> = ({
  delMemberTabledata,
  setIsOperationInProgress,
}) => {
  return (
    <Drawer>
      <DrawerTrigger className="pr-2 pb-2">
        <Button>View Deleted Members</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DeleteTableView
          delMemberTabledata={delMemberTabledata}
          setIsOperationInProgress={setIsOperationInProgress}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="default">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default ManageDelete;
