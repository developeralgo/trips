<template>
  <UContainer>
    <div>
      <UModal
        title="Are you sure you want to delete this record?"
        v-model:open="isOpen"
        close-icon="i-lucide-arrow-right"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
      >
        <UButton
          label="Delete Record"
          color="warning"
          variant="solid"
          icon="i-lucide-trash-2"
        />

        <template #body>
          <div class="p-6">
            <UButton
              @click="deleteRecord"
              color="warning"
              icon="i-lucide-trash-2"
              >Yes Delete this shit!</UButton
            >
          </div>
        </template>
      </UModal>
    </div>
    <div>Record {{ id }}</div>

    <UCard>
      <div class="flex flex-col max-w-sm gap-6">
        <div>Date: {{ new Date(record.date).toLocaleString("en-US") }}</div>
        <div>Start Time: {{ record.startTime }}</div>
        <UInput type="time" placeholder="End Time" v-model="record.endTime" />
        <div>
          <div class="flex gap-6 items-center">
            <label for="">Start KM</label>
            <UInput
              type="number"
              placeholder="earnings"
              v-model="record.startKm"
              label="Earnings"
            />
          </div>
        </div>
        <div>
          <div class="flex gap-6 items-center">
            <label for="">End Km</label>
            <UInput
              type="number"
              placeholder="End Km"
              v-model="record.endKm"
              label="endKm"
            />
          </div>
        </div>
        <div>Distance Traveled: {{ distanceTraveled }}</div>
        <div>
          <div class="flex gap-6 items-center">
            <label for="">Ernings</label>
            <UInput
              type="number"
              placeholder="earnings"
              v-model="record.earnings"
              label="Earnings"
            />
          </div>
        </div>
      </div>
      <UButton @click="updateRecord">Update Record</UButton>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { calculateDuration } from "~/utils/functions";
let toast = useToast();
let isOpen = ref(false);
let route = useRoute();

let record = ref({});
let correctingDate = ref("");

let StringDate = computed(() => {
  return new Date(record.value.date).toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
});
let id = route.params.id;
async function getSingleRecord() {
  const response = await $fetch(`/api/records/${id}`);
  record.value = response.data;
}
getSingleRecord();

async function deleteRecord() {
  const response = await $fetch(`/api/records/${id}`, {
    method: "post",
    body: {
      id: id,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.data) {
    isOpen.value = false;
    toast.add({
      title: "Success",
      description: "Record has been deleted, redirecting to home",
      type: "foreground",
    });
    return navigateTo("/");
  }
}

let distanceTraveled = computed(() => {
  return Number(record.value.endKm) - Number(record.value.startKm);
});

async function updateRecord() {
  const durationMinutes = calculateDuration(
    record.value.startTime,
    record.value.endTime
  );

  const startDateTime = buildDateTime(
    record.value.date,
    record.value.startTime
  );

  const endDateTime = buildDateTime(record.value.date, record.value.endTime);

  const distance = distanceTraveled.value;
  const response = await $fetch("/api/records/update/" + id, {
    method: "POST",
    body: {
      startTime: record.value.startTime,
      endTime: record.value.endTime,
      endDateTime: endDateTime,
      endKm: record.value.endKm,
      duration: durationMinutes,
      distance,
      earnings: record.value.earnings,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  if (response.data) {
    toast.add({
      title: "Success",
      description: "Record has been updated",
      type: "foreground",
    });
    return navigateTo("/");
  }
}
</script>
