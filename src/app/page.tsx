"use client";
import { useState } from "react";

const words = [
  "ball",
  "ball",
  "barking",
  "behind",
  "came",
  "child",
  "day",
  "dogs",
  "dogs'",
  "every",
  "fence",
  "field",
  "game",
  "going",
  "hard",
  "he",
  "he",
  "heard",
  "helped",
  "house",
  "it",
  "joining",
  "kicked",
  "large",
  "liked",
  "lived",
  "loud",
  "marias",
  "monday",
  "neighbors",
  "one",
  "out",
  "over",
  "owner",
  "played",
  "retrieve",
  "Ricky",
  "so",
  "soccer",
  "their",
  "them",
  "three",
  "three-thirty",
  "went",
];

const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const tens = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const teens = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

function convert_millions(num: number): string {
  if (num >= 1000000) {
    return (
      convert_millions(Math.floor(num / 1000000)) +
      " million " +
      convert_thousands(num % 1000000)
    );
  } else {
    return convert_thousands(num);
  }
}

function convert_thousands(num: number): string {
  if (num >= 1000) {
    return (
      convert_hundreds(Math.floor(num / 1000)) +
      " thousand " +
      convert_hundreds(num % 1000)
    );
  } else {
    return convert_hundreds(num);
  }
}

function convert_hundreds(num: number): string {
  if (num > 99) {
    return ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100);
  } else {
    return convert_tens(num);
  }
}

function convert_tens(num: number): string {
  if (num < 10) return ones[num];
  else if (num >= 10 && num < 20) return teens[num - 10];
  else {
    return tens[Math.floor(num / 10)] + " " + ones[num % 10];
  }
}

function convert(num: number): string {
  if (num == 0) return "zero";
  else return convert_millions(num);
}

function transform_transcript(text: string): string[] {
  const t: string = text.trim();
  const user_dict: string[] = t
    .split(/\s+/)
    .sort()
    .map((word) => {
      if (!isNaN(Number(word))) {
        return convert(Number(word)).trimEnd();
      }
      return word.toLowerCase().replace(/[.,!?;:()]/g, "");
    })
    .sort();
  return user_dict;
}

// Utility to normalize words for matching
function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[.,!?;:()']/g, "");
}

// Simple verb normalization for matching conjugations
function getVerbRoot(word: string): string {
  const w = word.toLowerCase();
  // Handle irregulars
  if (w === "went") return "go";
  if (w === "gone") return "go";
  if (w === "does") return "do";
  if (w === "did") return "do";
  if (w === "has") return "have";
  if (w === "had") return "have";
  if (
    w === "is" ||
    w === "am" ||
    w === "are" ||
    w === "was" ||
    w === "were" ||
    w === "been" ||
    w === "being"
  )
    return "be";
  // Handle "come" conjugations
  if (w === "came") return "come";
  if (w === "coming") return "come";
  // Regular endings
  if (w.endsWith("ing")) return w.slice(0, -3);
  if (w.endsWith("ed") && w !== "liked" && w !== "lived") return w.slice(0, -2);
  if (w === "liked") return "like";
  if (w === "lived") return "live";
  if (w.endsWith("es")) return w.slice(0, -2);
  if (w.endsWith("s") && w.length > 3) return w.slice(0, -1);
  return w;
}

function isVerb(word: string): boolean {
  // List of verbs in your story (expand as needed)
  const verbs = [
    "play",
    "played",
    "playing",
    "kick",
    "kicked",
    "kicking",
    "like",
    "liked",
    "liking",
    "go",
    "goes",
    "going",
    "went",
    "gone",
    "help",
    "helped",
    "helping",
    "hear",
    "heard",
    "hearing",
    "retrieve",
    "retrieved",
    "retrieving",
    "join",
    "joining",
    "joined",
    "live",
    "lived",
    "living",
    "bark",
    "barked",
    "barking",
    // Add more as needed
  ];
  return verbs.includes(word.toLowerCase());
}

export default function Home() {
  const [userDict, setUserDict] = useState<string[]>([]);
  let search_index = 0;
  let num_found = 0;
  const discarded: string[] = [];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl w-full space-y-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Craft Story
        </h1>
        <p className="text-lg leading-relaxed text-gray-600 bg-white p-6 rounded-lg shadow-sm">
          {
            "Maria's child Ricky played soccer every Monday at 3:30. He liked going to the field behind their house and joining the game. "
          }
          {
            "One day, he kicked the ball so hard that it went over the neighbor's fence where three large dogs lived. "
          }
          {
            "The dogs' owner heard loud barking, came out, and helped them retrieve the ball. "
          }
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const transcript = formData.get("transcript");
            const user_dict = transform_transcript(transcript as string);
            setUserDict(user_dict);
            // Update the state or perform any other action with user_dict
            console.log("Transformed user dict:", userDict);
            // console.log("words:", words);

            search_index = 0;
            num_found = 0;
          }}
        >
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-center">
            <strong>Note:</strong> Please enter times in hour-minute format
            using words and a hyphen. For example,{" "}
            <span className="font-mono bg-blue-100 px-2 rounded">3:30</span>{" "}
            should be inputed as{" "}
            <span className="font-mono bg-blue-100 px-2 rounded">
              three-thirty
            </span>
            .
          </div>
          <textarea
            name="transcript"
            className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            placeholder="Enter your text here..."
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-sm"
          >
            Submit
          </button>
        </form>
        <div>
          <div className="p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-2  ">
              <div className="">
                <h2 className="text-2xl font-bold mb-4">Word List</h2>
                <div className="grid grid-cols-1 gap-4">
                  {words.map((word, index) => {
                    return (
                      <div
                        key={index}
                        className="border-b border-gray-300 flex justify-between items-center"
                      >
                        <div>
                          <span className="text-gray-300 mr-2">
                            {index + 1}.
                          </span>
                          <span>{word}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="">
                <h2 className="text-2xl font-bold mb-4">Your Words</h2>
                <div className="grid grid-cols-1 gap-4">
                  {userDict.map((userWord) => {
                    let matched = false;
                    let normalizedUserWord = normalizeWord(userWord);
                    if (isVerb(userWord)) {
                      normalizedUserWord = getVerbRoot(userWord);
                    }
                    for (let i = 0; i < words.length; i++) {
                      const word = words[i];
                      let normalizedWord = normalizeWord(word);
                      if (isVerb(word)) {
                        normalizedWord = getVerbRoot(word);
                      }
                      if (normalizedUserWord === normalizedWord) {
                        matched = true;
                        break;
                      }
                    }
                    if (!matched) {
                      discarded.push(userWord);
                    }
                    return null; // This loop is only for populating discarded
                  })}

                  {words.map((word, index) => {
                    let found = false;
                    let _word = normalizeWord(word);
                    let found_index = 0;

                    if (isVerb(word)) {
                      _word = getVerbRoot(word);
                    }

                    // Only search if userDict has entries
                    if (userDict.length > 0) {
                      for (let i = search_index; i < userDict.length; i++) {
                        let userWord = normalizeWord(userDict[i]);
                        if (isVerb(userWord)) {
                          userWord = getVerbRoot(userWord);
                        }
                        if (userWord === _word) {
                          found = true;
                          num_found++;
                          found_index = i;
                          search_index = i + 1;
                          break;
                        }
                      }
                    }
                    return (
                      <div
                        key={index}
                        className="border-b border-gray-300 flex"
                      >
                        <div>
                          <span className="text-gray-300 mr-2">
                            {index + 1}.
                          </span>
                          {found ? (
                            <span className="">{userDict[found_index]}</span>
                          ) : (
                            <span className="text-red-500">Not Found</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {discarded.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Discarded Words</h3>
                <div className="">
                  {discarded.join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-blue-700 font-semibold text-3xl justify-center text-center">
          Score: {num_found} / {words.length}
        </div>
      </div>
    </div>
  );
}
