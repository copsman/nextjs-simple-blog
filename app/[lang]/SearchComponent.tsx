'use client'
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { animals } from "../dictionaries/data";
import Link from "next/link";
import { SearchIcon } from "../utils/SearchIcon";
import { use, useEffect } from "react";

interface SearchComponentProps {
    dictionary: any;
}

type JsonType = {
    [key: string]: any;
};

// Function to recursively find objects with a 'searchable' key
function findSearchableObjects(obj: JsonType, path: string = '', cardsList: JsonType[] = []) {
    // console.log(obj);
    // Iterate over all object keys
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newPath = path ? `${path}.${key}` : key;

            // If the current property is an object, recurse
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                findSearchableObjects(obj[key], newPath, cardsList);
            } else if (key === 'searchable' && obj[key] === true) {
                // Found a 'searchable' key with value true

                //console.log(`Found 'searchable' at path: ${newPath}`);
                //console.log(obj);
                cardsList.push({ value: obj?.title, label: obj?.title, description: obj?.content });
                // If you need to process the object further, you can do it here
                // For example, you might want to store the path or the object in an array
            }
        }
    }
    //console.log(cardsList);
    return cardsList;
}
export default function SearchComponent(props: SearchComponentProps) {
    //console.log(props.dictionary)

    const cardsList = findSearchableObjects(props.dictionary);
    console.log(cardsList);
    // useEffect(() => {
    //     findSearchableObjects(props.dictionary);
    // }, []);
    //findSearchableObjects(props.dictionary);
    //console.log(cardsList);
    // Object.keys(props.dictionary.main_page.cards).forEach((key) => {
    //     console.log(key, props.dictionary.main_page.cards[key]);
    // }
    // );

    return (
        <div>
            <Autocomplete
                defaultItems={cardsList}
                label="Cards"
                placeholder="Search a card"
                className="max-w-xs"
                isClearable={false}
                disableSelectorIconRotation
                disableAnimation
                selectorIcon={<SearchIcon size={20} />}
            >
                {(animal) =>
                    <AutocompleteItem key={animal.value} textValue={animal.label}>
                        <div className="flex flex-1 min-w-full">
                            {animal.label}
                        </div>
                        <div className="flex flex-1 min-w-full">
                            {animal.description}
                        </div>
                    </AutocompleteItem>}
            </Autocomplete>
        </div>
    );
}