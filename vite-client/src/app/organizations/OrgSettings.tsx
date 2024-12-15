import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateUserDetails } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const OrgSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.auth); // Access Redux store
  const [formData, setFormData] = useState(userDetails); // Initial state from userDetails
  // Save all changes
  const handleSaveChanges = () => {
    dispatch(updateUserDetails(formData));
  };
  return (
    <main>
      <section>org settings</section>
      <Separator className="my-4" />
      <Button onClick={handleSaveChanges} className="w-full">
        Save Changes
      </Button>
    </main>
  );
};

export default OrgSettings;
