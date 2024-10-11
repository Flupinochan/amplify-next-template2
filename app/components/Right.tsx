import React from "react";
import { signOut } from 'aws-amplify/auth';
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { clearEmail } from "@/app/features/userSlice";

const Right: React.FC = () => {
  const email = useSelector((state: RootState) => state.user.email);
  const dispatch = useDispatch();
  async function handleSignOut() {
    dispatch(clearEmail());
    await signOut()
  }

  return (
    <div className="w-1/6 flex flex-col justify-start items-center p-3 m-3 border-primary border-2">
      <Button variant="contained" onClick={handleSignOut}>Sign Out</Button>
      <div>
        <p className="text-primary text-sm p-2 break-all">{email}</p>
      </div>
    </div>
  );
};

export default Right;
