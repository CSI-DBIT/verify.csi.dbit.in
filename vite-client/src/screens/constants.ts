import {
  Bookmark,
  Puzzle,
  Server,
  ServerOff,
  Shrub,
  Speech,
  Trophy,
} from "lucide-react";

interface GenderText {
  [key: number]: string;
}

// Use the defined type
export const genderText: GenderText = {
  1: "Male",
  2: "Female",
  3: "Others",
};

interface BranchText {
  [key: number]: string;
}

// Use the defined type
export const branchText: BranchText = {
  0: "All Branches",
  1: "Information Technology",
  2: "Computer Science",
  3: "Electronics & Telecommunication",
  4: "Mechanical Engineering",
};

interface CurrentAcademicYearText {
  [key: number]: string;
}

// Use the defined type
export const currentAcademicYearText: CurrentAcademicYearText = {
  0: "All",
  1: "FE",
  2: "SE",
  3: "TE",
  4: "BE",
};
interface CurrentSemesterText {
  [key: number]: string;
}

// Use the defined type
export const currentSemesterText: CurrentSemesterText = {
  0: "All",
  1: "Sem 1",
  2: "Sem 2",
  3: "Sem 3",
  4: "Sem 4",
  5: "Sem 5",
  6: "Sem 6",
  7: "Sem 7",
  8: "Sem 8",
};

interface DurationText {
  [key: number]: string;
}

// Use the defined type
export const durationText: DurationText = {
  1: "One Year",
  2: "Two Years",
  3: "Three Years",
};
interface EventCategoryText {
  [key: number]: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

// Use the defined type
export const eventCategoryText: EventCategoryText = {
  1: {
    name: "Talks",
    icon: Speech,
  },
  2: {
    name: "Competitions",
    icon: Trophy,
  },
  3: {
    name: "Workshops",
    icon: Puzzle,
  },
  4: {
    name: "Others",
    icon: Bookmark,
  },
};
interface EventTypeText {
  [key: number]: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

// Use the defined type
export const eventTypeText: EventTypeText = {
  1: {
    name: "Technical",
    icon: Server,
  },
  2: {
    name: "Non Technical",
    icon: ServerOff,
  },
  3: {
    name: "Others",
    icon: Shrub,
  },
};
