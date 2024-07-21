"use client";
import React from "react";
import SideBarHeaderLayout from "../_components/SidebarHeaderLayout";
import EditableTable from "../_components/editableTable";

export default function Page() {
  return (
    <SideBarHeaderLayout title="Transactions">
      <EditableTable />
    </SideBarHeaderLayout>
  );
}
