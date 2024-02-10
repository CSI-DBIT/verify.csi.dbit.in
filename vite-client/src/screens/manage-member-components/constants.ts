// Map numeric values to corresponding text for branch
interface BranchText {
  [key: number]: string;
}

// Use the defined type
export const branchText: BranchText = {
  1: "Information Technology",
  2: "Computer Science",
  3: "Electronics & Telecommunication",
  4: "Mechanical Engineering",
};

// Map numeric values to corresponding text for duration
interface DurationText {
    [key: number]: string;
}

// Use the defined type
export const durationText: DurationText = {
    1: "One Year",
    2: "Two Years",
    3: "Three Years",
};

