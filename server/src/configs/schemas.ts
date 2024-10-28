import { t } from "elysia";

export const signupOrganizationSchema = t.Object({
  orgName: t.String({ maxLength: 60, minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  description: t.String({ maxLength: 150, minLength: 1 }),
  logo: t.Optional(t.String()),
  address: t.Optional(t.String({ maxLength: 200 })),
  phoneNo: t.Optional(t.String({ maxLength: 20 })),
});
export const loginOrganizationSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export const updatedOrganizationSchema = t.Partial(
  t.Object({
    orgName: t.String({ maxLength: 60, minLength: 3 }),
    description: t.String({ maxLength: 150, minLength: 1 }),
    logo: t.String(),
    address: t.String({ maxLength: 200 }),
    phoneNo: t.String({ maxLength: 20 }),
  })
);

export const signupMemberSchema = t.Object({
  memberName: t.String({ maxLength: 60, minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  gender: t.Enum({ male: "MALE", female: "FEMALE", other: "OTHER" }),
  address: t.Optional(t.String({ maxLength: 200 })),
  phoneNo: t.Optional(t.String({ maxLength: 10 })),
  memberImg: t.Optional(t.String()),
});

export const loginMemberSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export const updateMemberSchema = t.Partial(
  t.Object({
    memberName: t.String({ maxLength: 60, minLength: 3 }),
    gender: t.Enum({ male: "MALE", female: "FEMALE", other: "OTHER" }),
    address: t.String({ maxLength: 200 }),
    phoneNo: t.String({ maxlength: 20 }),
    memberImg: t.String(),
  })
);

export const addEventCategorySchema = t.Object({
  names: t.Array(t.String()),
});
export const updateEventCategorySchema = t.Object({
  categories: t.Array(
    t.Object({
      categoryId: t.String(),
      name: t.String(),
    })
  ),
});

export const addSocialUrlSchema = t.Object({
  urls: t.Array(
    t.Object({
      platform: t.String(),
      url: t.String(),
    })
  ),
});

export const updateSocialUrlSchema = t.Object({
  urls: t.Array(
    t.Object({
      urlId: t.String(),
      url: t.String(),
    })
  ),
});

export const addEventSchema = t.Object({
  eventName: t.String(),
  description: t.String({ maxLength: 150, minLength: 1 }),
  eventBannerImg: t.Optional(t.String()),
  categoryId: t.String(),
  isMemberOnly: t.Boolean(),
  eventDate: t.Date(),
});

export const updateEventSchema = t.Partial(addEventSchema);

export const createMembershipSchema = t.Object({
  organizationId: t.Optional(t.String()),
  memberId: t.Optional(t.String()),
});
export const updateMembershipSchema = t.Object({
  status: t.String(),
});
