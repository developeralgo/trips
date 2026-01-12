<template>
  <UContainer>
    <div class="flex flex-col max-w-sm gap-6 mt-6">
      <label for="">Date</label>
      <UInput type="date" placeholder="Date" v-model="record.date" />
      <div class="grid grid-cols-2 gap-4">
        <label for="">Start Time</label>
        <UInput type="time" placeholder="Time" v-model="record.startTime" />
        <label for="">End Time</label>
        <UInput type="time" placeholder="Time" v-model="record.endTime" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <label for=""> Start Km</label>
        <UInput
          type="number"
          placeholder="Starting KM"
          v-model="record.startKm"
        />
        <label for="">End Km</label>
        <UInput type="number" placeholder="Ending KM" v-model="record.endKm" />
      </div>
      <label for="">Earnings</label>
      <UInput type="number" placeholder="earnings" v-model="record.earnings" />
      <div class="flex gap-6">
        <UButton @click="addRecord" class="mx-auto" icon="i-lucide-plus"
          >Add Record</UButton
        >
        <UButton @click="resetRecords" class="mx-auto" icon="" color="warning"
          >Reset Record</UButton
        >
      </div>
    </div>
    <USeparator label="Trips List" class="my-12" />
    <div class="">
      <div>
        <UButton @click="getAllRecords" color="info" icon="i-lucide-refresh-ccw"
          >Refresh Records</UButton
        >
      </div>
      <UTable :data="records" class="flex-1" :columns="columns" sticky />
    </div>
  </UContainer>
</template>
<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";

import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
const UButton = resolveComponent("UButton");
const NuxtLink = resolveComponent("NuxtLink");
import { calculateDuration, buildDateTime } from "~/utils/functions";
let toast = useToast();
let record = ref({
  date: "",
  startTime: "",
  endTime: "",
  duration: "",
  startKm: "",
  endKm: "",
  distance: "",
  earnings: "",
});
let DATE = shallowRef(new CalendarDate(2026, 1, 1));
let records = ref([]);

async function getAllRecords() {
  const response = await $fetch("/api/getAllRecords");
  records.value = response.data.map((element) => {
    return { ...element, link: `/records/${element._id}` };
  });
}

async function addRecord() {
  if (record.value.startKm === "") {
    toast.add({
      title: "Error KM is required",
      description: "Please enter a valid value",
      type: "foreground",
    });
    return;
  }

  const durationMinutes = calculateDuration(
    record.value.startTime,
    record.value.endTime
  );

  const startDateTime = buildDateTime(
    record.value.date,
    record.value.startTime
  );

  const endDateTime = buildDateTime(record.value.date, record.value.startTime);

  const distance = Number(record.value.endKm) - Number(record.value.startKm);

  const response = await $fetch("/api/saveNewRecord", {
    method: "POST",
    body: {
      ...record.value,
      date: startDateTime.toISOString(),
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      duration: durationMinutes,
      distance,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.data.acknowledged) {
    getAllRecords();
  }
  toast.add({
    title: "Success",
    description: "Record has been added",
    type: "foreground",
  });
}
async function resetRecords() {
  record.value = {
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    startKm: "",
    endKm: "",
    distance: "",
    earnings: "",
  };
}

getAllRecords();
const columns: TableColumn[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "startKm",
    header: "Start Km",
  },
  {
    accessorKey: "endKm",
    header: "End Km",
  },
  {
    accessorKey: "distance",
    header: "Distance",
    meta: {
      class: {
        th: "",
        td: "font-medium",
      },
    },
  },

  {
    id: "view",
    header: "View",
    cell: ({ row }) =>
      h(
        NuxtLink,
        {
          to: `/records/${row.original._id}`,
          class: "text-primary font-medium hover:underline",
        },
        () => "Open"
      ),
  },
];
const sorting = ref([
  {
    id: "date",
    desc: false,
  },
]);
</script>
