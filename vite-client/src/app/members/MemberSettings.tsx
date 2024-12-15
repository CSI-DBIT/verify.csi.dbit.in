import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  FacebookIcon,
  GlobeIcon,
  Hash,
  InstagramIcon,
  Linkedin,
  TwitterIcon,
} from "lucide-react";

import "react-image-crop/dist/ReactCrop.css";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { DevTool } from "@hookform/devtools";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { COUNTRIES } from "@/constants/constants";
import { toast } from "sonner";
const MemberSettings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImage, setProfileImage] = useState<File | string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageElement = new Image();
        imageElement.src = reader.result as string;
        imageElement.onload = (e: any) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth < 150 || naturalHeight < 150) {
            toast("Image must be atLeast 150 x 150 px", { dismissible: true });
            return setProfileImage("");
          }
        };
        memberSettingForm.setValue("memberImg", "file");
        memberSettingForm.trigger("memberImg");
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop,
  });

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "contact", label: "Contact Information" },
    { id: "professional", label: "Professional Information" },
    { id: "account", label: "Account Settings" },
  ];

  const handleNavigate = (tab: string) => {
    const section = document.getElementById(tab);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // Scroll to the section
      setActiveTab(tab); // Update the active tab
    }
  };

  const memberSettingFormSchema = z.object({
    memberName: z.string().min(1, { message: "Member name is required." }),
    about: z.string({ required_error: "About is required" }).max(200),
    email: z.string().email(),
    password: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"], {
      required_error: "You need to select a gender.",
    }),
    phoneNo: z.string(),
    alternatePhoneNo: z.string(),
    memberImg: z.union([z.instanceof(File), z.string()]),
    memberStatus: z.string(),
    birthdate: z.date(),
    country: z.string({
      required_error: "Please select a language.",
    }),
    city: z.string(),
    occupation: z.string(),
    companyName: z.string(),
    socialUrls: z
      .object({
        platform: z.string(),
        url: z.string({
          required_error: "Please enter social link",
        }),
      })
      .array(),
  });

  const memberSettingForm = useForm<z.infer<typeof memberSettingFormSchema>>({
    resolver: zodResolver(memberSettingFormSchema),
    defaultValues: {
      memberName: "John Doe",
      about: "A passionate developer",
      email: "test@mail.com",
      password: "test@12345",
      gender: "MALE",
      phoneNo: "1234567891",
      alternatePhoneNo: "",
      memberImg: "",
      memberStatus: "🙂",
      birthdate: new Date(),
      country: "",
      city: "",
      occupation: "",
      companyName: "",
      socialUrls: [],
    },
  });
  const isDirty = Object.keys(memberSettingForm.formState.dirtyFields).length;
  useUnsavedChangesWarning(Boolean(isDirty));

  function onSubmit(values: z.infer<typeof memberSettingFormSchema>) {
    console.log(values);
  }

  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedLinks = [...memberSettingForm.getValues("socialUrls")];
    const url = e.target.value;
    updatedLinks[index] = {
      url,
      platform: detectSocialPlatform(url),
    };
    memberSettingForm.setValue("socialUrls", updatedLinks);
  };
  const detectSocialPlatform = (url: string): string => {
    if (/facebook\.com/i.test(url)) return "Facebook";
    if (/twitter\.com/i.test(url)) return "Twitter";
    if (/linkedin\.com/i.test(url)) return "LinkedIn";
    if (/instagram\.com/i.test(url)) return "Instagram";
    return "Unknown";
  };
  const getSocialPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <FacebookIcon className="size-4 text-blue-600" />;
      case "Twitter":
        return <TwitterIcon className="size-4 text-blue-400" />;
      case "LinkedIn":
        return <Linkedin className="size-4 text-blue-700" />;
      case "Instagram":
        return <InstagramIcon className="size-4 text-pink-500" />;
      default:
        return <GlobeIcon className="size-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex px-6">
      {/* Vertical Tabs */}
      <div className="w-1/4 rounded-md shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id} className="relative">
              {activeTab === tab.id && (
                <span className="absolute -left-2 top-2 h-5 w-1 bg-blue-500 rounded"></span>
              )}
              <Button
                size={"sm"}
                onClick={() => handleNavigate(tab.id)}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
              >
                {tab.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="w-3/4 rounded-md shadow-md p-6 ml-6">
        <Form {...memberSettingForm}>
          <form onSubmit={memberSettingForm.handleSubmit(onSubmit)}>
            <div className="h-[500px] overflow-y-auto flex flex-col gap-8 p-1">
              {/* Personal Information */}
              <section id="personal" className="space-y-4 ">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Hash
                    onClick={() => handleNavigate("personal")}
                    className="size-4 cursor-pointer hover:text-zinc-400"
                  />
                  <span>Personal Information</span>
                </h3>
                <section className="flex items-center gap-10">
                  <div className="space-y-4 w-full">
                    <FormField
                      control={memberSettingForm.control}
                      name="memberName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={memberSettingForm.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us about yourself"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative">
                    <FormField
                      control={memberSettingForm.control}
                      name="memberImg"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="outline-none rounded-full">
                                <Avatar className="md:size-44 min-w-24">
                                  <AvatarImage
                                    className="object-cover"
                                    src={
                                      profileImage ||
                                      `${import.meta.env.VITE_SERVER_URL}/${
                                        {...field}
                                      }`
                                    }
                                    alt="Profile Picture"
                                  />
                                  <AvatarFallback className="capitalize">
                                    {`${
                                      memberSettingForm.getValues(
                                        "memberName"
                                      )?.[0]
                                    } ${
                                      memberSettingForm.getValues(
                                        "memberName"
                                      )?.[1]
                                    }` || "M"}
                                  </AvatarFallback>
                                </Avatar>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <DropdownMenuItem
                                    onSelect={(e: any) => e.preventDefault()}
                                  >
                                    edit photo
                                  </DropdownMenuItem>
                                </div>
                                <DropdownMenuItem
                                  onSelect={() => {
                                    setProfileImage("");
                                    memberSettingForm.setValue("memberImg", "");
                                  }}
                                >
                                  remove photo
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={memberSettingForm.control}
                      name="memberStatus"
                      render={({ field }) => (
                        <Popover
                          open={isEmojiPickerOpen}
                          onOpenChange={setIsEmojiPickerOpen}
                        >
                          <PopoverTrigger className="absolute bottom-1 left-0 rounded-full size-10 border-2 border-secondary bg-zinc-950 hover:bg-zinc-900 outline-none">
                            {field.value}
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-full p-0 rounded-lg"
                            side="left"
                          >
                            <Picker
                              data={data}
                              onEmojiSelect={(emoji: any) => {
                                memberSettingForm.setValue(
                                  "memberStatus",
                                  emoji.native
                                );
                                memberSettingForm.trigger("memberStatus");
                                memberSettingForm.setFocus("memberStatus");
                                setIsEmojiPickerOpen(false); // Close picker
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </section>
                <FormField
                  control={memberSettingForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-3"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="MALE" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="FEMALE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="OTHERS" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Others
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={memberSettingForm.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e);
                              setIsCalendarOpen(false);
                            }}
                            initialFocus
                            fromYear={1960}
                            toYear={2030}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberSettingForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Country</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? COUNTRIES.find(
                                    (country) => country.value === field.value
                                  )?.label
                                : "Select country"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                              <CommandEmpty>No Country found.</CommandEmpty>
                              <CommandGroup>
                                {COUNTRIES.map((country) => (
                                  <CommandItem
                                    value={country.label}
                                    key={country.id}
                                    onSelect={() => {
                                      memberSettingForm.setValue(
                                        "country",
                                        country.value
                                      );
                                    }}
                                  >
                                    {country.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        country.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This is the language that will be used in the dashboard.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberSettingForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="mumbai" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is used to locate your recommendation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Contact Information */}
              <section id="contact" className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Hash
                    onClick={() => handleNavigate("contact")}
                    className="size-4 cursor-pointer hover:text-zinc-400"
                  />
                  <span>Contact Information</span>
                </h3>
                <FormField
                  control={memberSettingForm.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberSettingForm.control}
                  name="alternatePhoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={memberSettingForm.control}
                  name="socialUrls"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FormLabel>
                        <span>Social Urls</span>
                        <span>
                          {field.value.length < 4 && (
                            <Button
                              type="button"
                              size="icon"
                              onClick={() => {
                                const updatedLinks = [
                                  ...memberSettingForm.getValues("socialUrls"),
                                  { url: "", platform: "" },
                                ];
                                memberSettingForm.setValue(
                                  "socialUrls",
                                  updatedLinks
                                );
                              }}
                            >
                              +
                            </Button>
                          )}
                        </span>
                      </FormLabel>
                      <div>
                        {field.value.map(
                          (
                            link: { url: string; platform: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              {link.platform && (
                                <span className="flex items-center gap-1">
                                  {getSocialPlatformIcon(link.platform)}
                                </span>
                              )}
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/username"
                                    value={link.url}
                                    onChange={(e) =>
                                      handleSocialLinkChange(e, index)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const updatedLinks = memberSettingForm
                                    .getValues("socialUrls")
                                    .filter((_, i) => i !== index);
                                  memberSettingForm.setValue(
                                    "socialUrls",
                                    updatedLinks
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                />
              </section>

              {/* Professional Information */}
              <section id="professional" className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Hash
                    onClick={() => handleNavigate("professional")}
                    className="size-4 cursor-pointer hover:text-zinc-400"
                  />
                  <span>Professional Information</span>
                </h3>
                <FormField
                  control={memberSettingForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Tata Steel" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is used for recommendation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberSettingForm.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Account Settings */}
              <section id="account" className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Hash
                    onClick={() => handleNavigate("account")}
                    className="size-4 cursor-pointer hover:text-zinc-400"
                  />
                  <span>Account Settings</span>
                </h3>
                <FormField
                  control={memberSettingForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberSettingForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-4">
              <Button type="submit" size={"sm"} disabled={isDirty === 0}>
                Save Changes
              </Button>
              {isDirty > 0 && (
                <Button
                  variant="outline"
                  size={"sm"}
                  onClick={() => memberSettingForm.reset()} // Reset form values
                >
                  Cancel
                </Button>
              )}
            </div>
            <DevTool
              control={memberSettingForm.control}
              placement="bottom-left"
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MemberSettings;
