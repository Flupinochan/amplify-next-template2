"use client";

import Left from "./components/Left";
import Center from "./components/Center";
import Right from "./components/Right";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setSelectedId } from "@/app/features/selectedIdSlice";

export default function App() {
  const dispatch = useDispatch();
  const selectedId = useSelector((state: RootState) => state.selectedId.selectedId);

  return (
    <main className="flex justify-center h-[70vh]">
      <Left selectedId={selectedId} onSelectId={(id) => dispatch(setSelectedId(id))}/>
      <Center selectedId={selectedId} />
      <Right />
    </main>
  );
}
