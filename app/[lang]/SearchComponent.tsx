'use client'
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { animals } from "../dictionaries/data";
import Link from "next/link";
import { SearchIcon } from "../utils/SearchIcon";
import { use, useEffect, useState } from "react";
import Fuse from 'fuse.js';
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

interface SearchComponentProps {
    dictionary: any;
}

type JsonType = {
    [key: string]: any;
};


// Function to normalize data to an array of objects
const normalizeData = (data: { [s: string]: unknown; } | ArrayLike<unknown>) => {
    if (Array.isArray(data)) {
        // Data is already an array of objects
        return data;
    } else if (typeof data === 'object') {
        // Convert object of objects to an array of objects
        return Object.values(data);
    }
    return []; // Return an empty array if data is neither
};

// Function to recursively find objects with a 'searchable' key
function findSearchableObjects(obj: JsonType, path: string = '', cardsList: JsonType[] = []) {


    Object.entries(obj).forEach(([pageKey, pageInfo]) => {
        // console.log(pageKey);
        // console.log(pageInfo);
        // Normalize cards and FAQs to arrays of objects
        const cardsArray = normalizeData(pageInfo.cards);
        const faqsArray = normalizeData(pageInfo.FAQs);


        // Process cards
        cardsArray.forEach(card => {
            cardsList.push({
                ...card,
                type: 'card',
                url: pageInfo.url + '#' + (card.id || ''), // Ensure URL is constructed properly even if id is missing
                id: card.id
            });
        });

        // Process FAQs
        faqsArray.forEach(faq => {
            cardsList.push({
                title: faq.question || faq.title, // Support both question/title keys
                content: faq.answer || faq.content, // Support both answer/content keys
                type: 'faq',
                url: pageInfo.url + '#' + (faq.id || ''), // Ensure URL is constructed properly even if id is missing
                id: faq.id
            });
        });

    });
    //console.log(obj);
    return cardsList;
}


const options = {
    keys: ["title", "content"],
    useExtendedSearch: true,
};

export default function SearchComponent(props: SearchComponentProps) {
    const router = useRouter()
    const [items, setItems] = useState<any>([]);
    const cardsList = findSearchableObjects(props.dictionary);
    console.log(cardsList);

    const fuse = new Fuse(cardsList, options);

    const search = (value: string) => {
        const results = fuse.search(`'"${value}"`);
        setItems(results.map((result: any) => result.item));
    }


    const handleSelectionChange = (value: any) => {

        //router.push(value.url);
        cardsList.forEach((card: any) => {
            if (card.id === value) {
                console.log(card.url);
                router.push(card.url, { scroll: true });
            }
        }
        )
        console.log(value);
    }
    return (
        <div>
            <Autocomplete
                items={items}
                onInputChange={search}
                label="Cards"
                placeholder="Search a card"
                className="max-w-xs"
                isClearable={false}
                disableSelectorIconRotation
                disableAnimation
                onSelectionChange={handleSelectionChange}
                selectorIcon={<SearchIcon size={20} />}
            >
                {(value: any) =>
                    <AutocompleteItem key={value?.id} textValue={value?.title}>
                        <div className="flex flex-1 min-w-full">
                            {value?.title}
                        </div>
                        <div className="flex flex-1 min-w-full">
                            {value?.content}
                        </div>
                    </AutocompleteItem>}
            </Autocomplete>
        </div>
    );
}