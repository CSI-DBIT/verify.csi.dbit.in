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
import ManageDeleteTableView from "./ManageDeleteTableView";
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
      <DrawerTrigger>
        <Button>View Deleted Members</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Deleted Member lists</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <ManageDeleteTableView
          delMemberTabledata={delMemberTabledata}
          setIsOperationInProgress={setIsOperationInProgress}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default ManageDelete;
