"use client";

import StaticDropdown from "@/components/base/Dropdown/StaticDropdown";
import TextArea from "@/components/base/TextArea";
import TextInput from "@/components/base/TextInput";
import { IEvent } from "@/shared/types/event.types";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const [formValues, setFormValues] = useState<IEvent>({
    agenda: [] as string[],
    tags: [] as string[],
    audience: "",
    date: "",
    description: "",
    location: "",
    title: "",
    time: "",
    slug: "",
    mode: "",
    venue: "",
    organizer: "",
    overview: "",
  } as IEvent);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all form values to FormData
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key as keyof IEvent];

      formData.append(key, value as string);
    });

    // Append the image file if present
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error("Error in Creating Event!");
    }
  };

  const changeHandler = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleArrayChange = (name: string, value: any) => {
    setFormValues({
      ...formValues,
      [name]: value.split(",").map((item: string) => item.toString().trim()),
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="px-3 flex flex-col md:justify-start justify-center items-center gap-8">
      <h1>Create New Event</h1>
      <div
        id="add-event"
        className="w-[700px] max-w-full rounded-[10px] bg-dark-100 border border-dark-200 p-8"
      >
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <TextInput
            name="title"
            placeholder="Event Title"
            value={formValues.title}
            onChange={changeHandler}
            label="Title"
          />
          <TextInput
            name="slug"
            label="Slug"
            placeholder="Event Slug"
            value={formValues.slug}
            onChange={changeHandler}
          />

          <TextInput
            name="date"
            placeholder="Date (2026-06-06)"
            value={formValues.date}
            onChange={changeHandler}
            label="Date"
          />
          <TextInput
            label="Time"
            name="time"
            placeholder="Time (10:10)"
            value={formValues.time}
            onChange={changeHandler}
          />
          <label className="relative flex items-center justify-center hover:bg-dark-300 text-white cursor-pointer w-full bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
            <div className="text-sm text-gray-400 flex flex-row! justify-start items-center gap-2">
              <p>{image ? image.name : "Upload event image or banner"}</p>
              {image ? (
                <Image
                  src="/icons/delete.svg"
                  alt="delete"
                  width={16}
                  height={16}
                  onClick={() => setImage(null)}
                />
              ) : (
                <></>
              )}
            </div>
            {!image ? (
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".png"
                onChange={handleImageChange}
              />
            ) : (
              <></>
            )}
          </label>
          <TextInput
            label="Venue"
            name="venue"
            placeholder="Venue"
            value={formValues.venue}
            onChange={changeHandler}
          />
          <TextInput
            label="Location"
            name="location"
            placeholder="Location"
            value={formValues.location}
            onChange={changeHandler}
          />

          <StaticDropdown
            options={[
              { label: "Online", value: "online" },
              { label: "Offline", value: "offline" },
              { label: "Hybrid", value: "hybrid" },
            ]}
            name="mode"
            label="Event Mode"
            value={formValues.mode}
            onChange={changeHandler}
          />
          <TextInput
            name="audience"
            placeholder="Target Audience"
            value={formValues.audience}
            onChange={changeHandler}
            label="Audience"
          />
          <TextInput
            name="organizer"
            placeholder="Organizer"
            value={formValues.organizer}
            onChange={changeHandler}
            label="Organizer"
          />
          <TextArea
            name="description"
            placeholder="Event Description"
            value={formValues.description}
            onChange={changeHandler}
            label="Description"
          />
          <TextArea
            name="overview"
            placeholder="Event Overview"
            value={formValues.overview}
            onChange={changeHandler}
            label="Overview"
          />
          <TextArea
            label="Agenda"
            name="agenda"
            placeholder="Enter agenda items separated by commas (e.g. Opening Ceremony, Panel Discussion)"
            value={formValues.agenda.join(", ")} // Display agenda items as comma-separated values
            onChange={handleArrayChange}
          />
          <TextArea
            label="Tags"
            name="tags"
            placeholder="Enter tags separated by commas (e.g. Tech, Networking, Business)"
            value={formValues.tags.join(", ")} // Display tags as comma-separated values
            onChange={(e) => handleArrayChange(e, "tags")}
          />

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
