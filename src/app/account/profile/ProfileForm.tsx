
"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ProfileFormProps = {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string | null;
  };
};

export default function ProfileForm({
  initialData,
}: ProfileFormProps) {
  const [form, setForm] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
    phone: initialData.phone,
  });

  const [imageUrl, setImageUrl] = useState(
    initialData.imageUrl || ""
  );

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState(
    initialData.imageUrl || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");
    setSuccess("");

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, PNG, WEBP, or GIF image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile image must be 5MB or smaller."
      );

      event.target.value = "";
      return;
    }

    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setPreviewUrl(newPreviewUrl);
  }

  function removeSelectedImage() {
    setSelectedImage(null);

    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(imageUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim()
    ) {
      setError(
        "First name and last name are required."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "firstName",
        form.firstName.trim()
      );

      formData.append(
        "lastName",
        form.lastName.trim()
      );

      formData.append(
        "phone",
        form.phone.trim()
      );

      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }

      const response = await fetch(
        "/api/account/profile",
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update profile."
        );
        return;
      }

      const updatedImageUrl =
        data.user?.imageUrl || imageUrl;

      setImageUrl(updatedImageUrl);
      setPreviewUrl(updatedImageUrl);
      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* PROFILE PHOTO */}
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-lg font-bold text-gray-900">
          Profile Photo
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add a photo so your Marketplace account is
          easier to recognize.
        </p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-orange-50">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-orange-500">
                {form.firstName
                  .charAt(0)
                  .toUpperCase()}
                {form.lastName
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              id="profileImage"
            />

            <div className="flex flex-wrap gap-3">
              <label
                htmlFor="profileImage"
                className="inline-flex cursor-pointer items-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {selectedImage
                  ? "Change Photo"
                  : "Upload Photo"}
              </label>

              {selectedImage && (
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              JPG, PNG, WEBP or GIF. Maximum 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Keep your personal information up to date.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            First name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Last name
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          disabled
          className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
        />

        <p className="mt-2 text-xs text-gray-500">
          Your email address cannot be changed here.
        </p>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Phone number
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          autoComplete="tel"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        <p className="mt-2 text-xs text-gray-500">
          Add the phone number you want to use for
          deliveries and account communication.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-48"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
