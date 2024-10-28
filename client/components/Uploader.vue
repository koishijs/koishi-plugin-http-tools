<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import FileUpload from "primevue/fileupload";
import ProgressBar from "primevue/progressbar";
import Button from "primevue/button";
import Badge from "primevue/badge";
import {send} from "@cordisjs/client";
const toast = useToast();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const uploading = ref([]);
const uploadedFiles = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};



const onTemplatedUpload = (data) => {
  console.info("UPLOADED");
  // toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
  console.info(data);
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = ['B','kB','MB','GB','TB','PB'];

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

function uploadRequestToServer(event:{files:File[]}){
  console.info(event);
  uploading.value.push(...event.files);
  uploadAll(event.files);
}

function uploadAll(files:File[]){
  files.forEach((f)=>{
    f.text().then((text)=>{
      return send('http/request.create', JSON.parse(text));
    }).then(()=>{
      const uploadIndex = uploading.value.findIndex(uf=>uf.name == f.name);
      if(uploadIndex != -1){
        uploading.value.splice(uploadIndex, 1);
      }
      uploadedFiles.value.push(f);
    })
  })
}

watch([files], (t)=>{
  console.info("Files",files);
})
</script>

<template>
    <div style="width: 30rem">
      <FileUpload name="uploadedRequest[]" customUpload @uploader="uploadRequestToServer" @upload="onTemplatedUpload($event)" :multiple="true" accept="application/json" :maxFileSize="1000000" @select="onSelectedFiles">
        <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
          <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
            <div class="flex gap-2">
              <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"></Button>
              <Button @click="uploadCallback()" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
              <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
            </div>
          </div>
        </template>
        <template #content="{ files, removeUploadedFileCallback, removeFileCallback }">
          <div class="flex flex-col gap-8 pt-4">
            <div v-if="files.length > 0">
              <h5>Pending</h5>
              <div class="flex flex-wrap gap-4">
                <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-row border border-surface items-center gap-4">
                  <span class="font-semibold text-ellipsis max-w-30 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                  <span>{{ formatSize(file.size) }}</span>
                  <Badge value="Pending" severity="warn" />
                  <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                </div>
              </div>
            </div>
            <div v-if="uploading.length > 0">
              <h5>Uploading</h5>
              <div class="flex flex-wrap gap-4">
                <div v-for="(file, index) of uploading" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                  <div class="flex flex-row gap-4">
                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                    <div>{{ formatSize(file.size) }}</div>
                    <div>0%</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="uploadedFiles.length > 0">
              <h5>Completed</h5>
              <div class="flex flex-wrap gap-4">
                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-row border border-surface items-center gap-4">
                  <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                  <div>{{ formatSize(file.size) }}</div>
                  <Badge value="Completed" class="mt-4" severity="success" />
                  <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded severity="danger" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <div class="flex items-center justify-center flex-col">
            <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
            <p class="mt-6 mb-0">拖拽文件到此处以上传</p>
          </div>
        </template>
      </FileUpload>
    </div>
</template>

<style scoped>

</style>
