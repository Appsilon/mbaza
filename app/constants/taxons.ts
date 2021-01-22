import { formatAnimalClassName } from "./animalsClasses";

type Taxon = {
  wi_taxon_id: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  common_name: string;
};

type TaxonMap = Record<string, Taxon>;

// Keep in sync with the CSV file in the models directory.
export const taxonMap: TaxonMap = {
  "Bird": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "Blank": {
    wi_taxon_id: "f1856211-cfb7-4a5b-9158-c0f72fd09ee6",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: "Blank"
  },
  "Buffalo_African": {
    wi_taxon_id: "9732cefb-6a08-49f6-b61e-b9a9054368c4",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Syncerus",
    species: "caffer",
    common_name: "African Buffalo"
  },
  "Cat_Golden": {
    wi_taxon_id: "99516caa-c7ca-41d9-998a-fcc9ee189dae",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Caracal",
    species: "aurata",
    common_name: "African Golden Cat"
  },
  "Chevrotain_Water": {
    wi_taxon_id: "578e82fe-ae7e-4a36-a00d-3ee7779c7899",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Tragulidae",
    genus: "Hyemoschus",
    species: "aquaticus",
    common_name: "Water Chevrotain"
  },
  "Chimpanzee": {
    wi_taxon_id: "5ff4999d-7a3c-4ad8-bf3e-3664fd25a71f",
    class: "Mammalia",
    order: "Primates",
    family: "Hominidae",
    genus: "Pan",
    species: "troglodytes",
    common_name: "Chimpanzee"
  },
  "Civet_African_Palm": {
    wi_taxon_id: "6a6ef0d0-309a-46cb-b9a1-bca994d0d5ba",
    class: "Mammalia",
    order: "Carnivora",
    family: "Nandiniidae",
    genus: "Nandinia",
    species: "binotata",
    common_name: "African Palm Civet"
  },
  "Duiker_Blue": {
    wi_taxon_id: "82401638-0e0c-4f83-a50b-efc7707e3524",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Philantomba",
    species: "monticola",
    common_name: "Blue Duiker"
  },
  "Duiker_Red": {
    wi_taxon_id: "3e34492e-b6d2-4db9-925d-301beb639cad",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Cephalophus",
    species: "",
    common_name: "Cephalophus Species"
  },
  "Duiker_Yellow_Backed": {
    wi_taxon_id: "3b799133-6737-4df0-bf8b-da20ded02732",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Cephalophus",
    species: "silvicultor",
    common_name: "Yellow-backed Duiker"
  },
  "Elephant_African": {
    wi_taxon_id: "a58bbd45-1dcf-46f0-9af6-579869da63ad",
    class: "Mammalia",
    order: "Proboscidea",
    family: "Elephantidae",
    genus: "Loxodonta",
    species: "",
    common_name: "Loxodonta Species"
  },
  "Genet": {
    wi_taxon_id: "9e251a37-cef9-4bf9-b876-2ca1279dc613",
    class: "Mammalia",
    order: "Carnivora",
    family: "Viverridae",
    genus: "Genetta",
    species: "",
    common_name: "Genetta Species"
  },
  "Gorilla": {
    wi_taxon_id: "d3739ec9-6c1a-4e77-8640-175cde6bf021",
    class: "Mammalia",
    order: "Primates",
    family: "Hominidae",
    genus: "Gorilla",
    species: "gorilla",
    common_name: "Western Gorilla"
  },
  "Guineafowl_Black": {
    wi_taxon_id: "fdead9ba-c38d-4e6f-9a41-81f3996d77a0",
    class: "Aves",
    order: "Galliformes",
    family: "Numididae",
    genus: "Agelastes",
    species: "niger",
    common_name: "Black Guineafowl"
  },
  "Guineafowl_Crested": {
    wi_taxon_id: "31ef4fb6-290e-43b8-8d1e-aef63eff86f4",
    class: "Aves",
    order: "Galliformes",
    family: "Numididae",
    genus: "Guttera",
    species: "plumifera",
    common_name: "Plumed Guineafowl"
  },
  "Hog_Red_River": {
    wi_taxon_id: "9a52e12e-aa3c-4b25-9f1d-13b9d71106e7",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Suidae",
    genus: "Potamochoerus",
    species: "porcus",
    common_name: "Red River Hog"
  },
  "Human": {
    wi_taxon_id: "990ae9dd-7a59-4344-afcb-1b7b21368000",
    class: "Mammalia",
    order: "Primates",
    family: "Hominidae",
    genus: "Homo",
    species: "sapiens",
    common_name: "Human"
  },
  "Leopard_African": {
    wi_taxon_id: "aa73e0ac-973d-461d-914a-d2fa6e4b98a4",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Panthera",
    species: "pardus",
    common_name: "Leopard"
  },
  "Mandrillus": {
    wi_taxon_id: "77a32c72-279e-40ab-acbc-58bb5d292d47",
    class: "Mammalia",
    order: "Primates",
    family: "Cercopithecidae",
    genus: "Mandrillus",
    species: "sphinx",
    common_name: "Mandrill"
  },
  "Mongoose": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "Mongoose_Black_Footed": {
    wi_taxon_id: "2e399a80-fdfc-4538-b648-80c6903e0267",
    class: "Mammalia",
    order: "Carnivora",
    family: "Herpestidae",
    genus: "Bdeogale",
    species: "",
    common_name: "Bdeogale Species"
  },
  "Monkey": {
    wi_taxon_id: "feb9186e-13c5-4806-8852-5768d3dcde79",
    class: "Mammalia",
    order: "Primates",
    family: "Cercopithecidae",
    genus: "",
    species: "",
    common_name: "Cercopithecidae Family"
  },
  "Pangolin": {
    wi_taxon_id: "b1cefdc9-af34-4f28-b077-1186dd6b5072",
    class: "Mammalia",
    order: "Pholidota",
    family: "Manidae",
    genus: "",
    species: "",
    common_name: "Pangolin Family"
  },
  "Porcupine_Brush_Tailed": {
    wi_taxon_id: "650f28c6-0c25-4c66-bf85-35a3bd622c75",
    class: "Mammalia",
    order: "Rodentia",
    family: "Hystricidae",
    genus: "Atherurus",
    species: "africanus",
    common_name: "African Brush-tailed Porcupine"
  },
  "Rail_Nkulengu": {
    wi_taxon_id: "27b48398-f1bd-4248-8844-b05e468b5634",
    class: "Aves",
    order: "Gruiformes",
    family: "Rallidae",
    genus: "Himantornis",
    species: "haematopus",
    common_name: "Nkulengu Rail"
  },
  "Rat_Giant": {
    wi_taxon_id: "699f6d38-8a0d-45e7-a1dc-e41da5794242",
    class: "Mammalia",
    order: "Rodentia",
    family: "Nesomyidae",
    genus: "Cricetomys",
    species: "emini",
    common_name: "Forest Giant Pouched Rat"
  },
  "Rodent": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "Squirrel": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "aardvark": {
    wi_taxon_id: "7a5a9437-883c-4a5b-b7f9-1d90ec457f46",
    class: "Mammalia",
    order: "Tubulidentata",
    family: "Orycteropodidae",
    genus: "Orycteropus",
    species: "afer",
    common_name: "Aardvark"
  },
  "aardwolf": {
    wi_taxon_id: "fa0d7796-5b11-450d-b15c-d49fdfe89d0e",
    class: "Mammalia",
    order: "Carnivora",
    family: "Hyaenidae",
    genus: "Proteles",
    species: "cristata",
    common_name: "Aardwolf"
  },
  "baboon": {
    wi_taxon_id: "ada5414d-2ce9-4be2-9691-bd8e7695366e",
    class: "Mammalia",
    order: "Primates",
    family: "Cercopithecidae",
    genus: "Papio",
    species: "anubis",
    common_name: "Olive Baboon"
  },
  "bat": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "batearedfox": {
    wi_taxon_id: "723584af-fbd4-4839-84be-cd89acacc070",
    class: "Mammalia",
    order: "Carnivora",
    family: "Canidae",
    genus: "Otocyon",
    species: "megalotis",
    common_name: "Bat-eared Fox"
  },
  "buffalo": {
    wi_taxon_id: "9732cefb-6a08-49f6-b61e-b9a9054368c4",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Syncerus",
    species: "caffer",
    common_name: "African Buffalo"
  },
  "bushbuck": {
    wi_taxon_id: "1ae5230b-5168-4491-ad4e-19583eb21b52",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Tragelaphus",
    species: "scriptus",
    common_name: "Bushbuck"
  },
  "caracal": {
    wi_taxon_id: "10ade100-b9c0-4e57-b09b-4df4a638e22d",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Caracal",
    species: "",
    common_name: "Caracal Species"
  },
  "cattle": {
    wi_taxon_id: "aca65aaa-8c6d-4b69-94de-842b08b13bd6",
    class: "Mammalia",
    order: "Artiodactyla",
    family: "Bovidae",
    genus: "Bos",
    species: "taurus",
    common_name: "Domestic Cattle"
  },
  "cheetah": {
    wi_taxon_id: "5a9b1344-2dd5-4162-9d85-77ee4648ad9c",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Acinonyx",
    species: "jubatus",
    common_name: "Cheetah"
  },
  "civet": {
    wi_taxon_id: "de7c35cc-387c-486d-bcf6-36b9feddcff7",
    class: "Mammalia",
    order: "Carnivora",
    family: "Viverridae",
    genus: "",
    species: "",
    common_name: "Civet Genet Family"
  },
  "dikdik": {
    wi_taxon_id: "0d859923-9aae-4510-bfe0-1c066996f5ed",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Madoqua",
    species: "",
    common_name: "Dik-Dik Species"
  },
  "duiker": {
    wi_taxon_id: "3e34492e-b6d2-4db9-925d-301beb639cad",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Cephalophus",
    species: "",
    common_name: "Cephalophus Species"
  },
  "eland": {
    wi_taxon_id: "6ffe2064-cabd-4fcb-8c1b-f168bf381aab",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Tragelaphus",
    species: "oryx",
    common_name: "Common Eland"
  },
  "elephant": {
    wi_taxon_id: "a58bbd45-1dcf-46f0-9af6-579869da63ad",
    class: "Mammalia",
    order: "Proboscidea",
    family: "Elephantidae",
    genus: "Loxodonta",
    species: "",
    common_name: "Loxodonta Species"
  },
  "empty": {
    wi_taxon_id: "f1856211-cfb7-4a5b-9158-c0f72fd09ee6",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: "Blank"
  },
  "gazellegrants": {
    wi_taxon_id: "8c48ed75-e275-4188-a6b1-55929d298e85",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Nanger",
    species: "granti",
    common_name: "Grant's Gazelle"
  },
  "gazellethomsons": {
    wi_taxon_id: "dc5dbe17-a8ca-40a6-ac6a-3b6b1d63e6d6",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Eudorcas",
    species: "thomsonii",
    common_name: "Thomson's Gazelle"
  },
  "genet": {
    wi_taxon_id: "de7c35cc-387c-486d-bcf6-36b9feddcff7",
    class: "Mammalia",
    order: "Carnivora",
    family: "Viverridae",
    genus: "",
    species: "",
    common_name: "Civet Genet Family"
  },
  "giraffe": {
    wi_taxon_id: "2dca052b-dff5-4cc9-8072-1282c5713286",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Giraffidae",
    genus: "Giraffa",
    species: "camelopardalis",
    common_name: "Giraffe"
  },
  "guineafowl": {
    wi_taxon_id: "83133617-8358-4910-82ee-4c23e40ba3dc",
    class: "Aves",
    order: "Galliformes",
    family: "Numididae",
    genus: "Numida",
    species: "meleagris",
    common_name: "Helmeted Guineafowl"
  },
  "hare": {
    wi_taxon_id: "d07fdf54-b3e5-46da-93a7-65fa5dda1055",
    class: "Mammalia",
    order: "Lagomorpha",
    family: "Leporidae",
    genus: "Lepus",
    species: "victoriae",
    common_name: "African Savanna Hare"
  },
  "hartebeest": {
    wi_taxon_id: "a6c4ef9a-d23f-49ca-97c6-4f859df0066e",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Alcelaphus",
    species: "buselaphus",
    common_name: "Hartebeest"
  },
  "hippopotamus": {
    wi_taxon_id: "7631afd3-ab8e-4e88-9243-2c21386595eb",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Hippopotamidae",
    genus: "Hippopotamus",
    species: "amphibius",
    common_name: "Hippopotamus"
  },
  "honeybadger": {
    wi_taxon_id: "a4f40e31-17f6-45b7-8b9d-e32af92a24df",
    class: "Mammalia",
    order: "Carnivora",
    family: "Mustelidae",
    genus: "Mellivora",
    species: "capensis",
    common_name: "Honey Badger"
  },
  "hyenaspotted": {
    wi_taxon_id: "dce8d520-a3f6-4ed7-a434-bfe98f81a03d",
    class: "Mammalia",
    order: "Carnivora",
    family: "Hyaenidae",
    genus: "Crocuta",
    species: "crocuta",
    common_name: "Spotted Hyaena"
  },
  "hyenastriped": {
    wi_taxon_id: "2e5b35a8-563f-4372-9f32-cb869448c88a",
    class: "Mammalia",
    order: "Carnivora",
    family: "Hyaenidae",
    genus: "Hyaena",
    species: "hyaena",
    common_name: "Striped Hyaena"
  },
  "impala": {
    wi_taxon_id: "c134e0ab-cf96-45ec-bae6-60b94995f71b",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Aepyceros",
    species: "melampus",
    common_name: "Impala"
  },
  "insectspider": {
    wi_taxon_id: "9fb844bd-26d1-49f1-a829-0025a48d3bdb",
    class: "Insecta",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: "Insect"
  },
  "jackal": {
    wi_taxon_id: "152e91ce-cadc-43ef-9d7a-084b7f752ebe",
    class: "Mammalia",
    order: "Carnivora",
    family: "Canidae",
    genus: "Canis",
    species: "mesomelas",
    common_name: "Black-backed Jackal"
  },
  "koribustard": {
    wi_taxon_id: "38296099-8b9b-4f18-9615-6d589384b04d",
    class: "Aves",
    order: "Otidiformes",
    family: "Otididae",
    genus: "Ardeotis",
    species: "kori",
    common_name: "Kori Bustard"
  },
  "leopard": {
    wi_taxon_id: "aa73e0ac-973d-461d-914a-d2fa6e4b98a4",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Panthera",
    species: "pardus",
    common_name: "Leopard"
  },
  "lionfemale": {
    wi_taxon_id: "ddf59264-185a-4d35-b647-2785792bdf54",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Panthera",
    species: "leo",
    common_name: "Lion"
  },
  "lionmale": {
    wi_taxon_id: "ddf59264-185a-4d35-b647-2785792bdf54",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Panthera",
    species: "leo",
    common_name: "Lion"
  },
  "mongoose": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "monkeyvervet": {
    wi_taxon_id: "0c72ac0d-6ed4-40f4-90ba-215dd1a7de8e",
    class: "Mammalia",
    order: "Primates",
    family: "Cercopithecidae",
    genus: "Chlorocebus",
    species: "pygerythrus",
    common_name: "Vervet Monkey"
  },
  "ostrich": {
    wi_taxon_id: "e2cbac0d-b4aa-4875-adc2-b1276c9276d3",
    class: "Aves",
    order: "Struthioniformes",
    family: "Struthionidae",
    genus: "Struthio",
    species: "camelus",
    common_name: "Common Ostrich"
  },
  "otherbird": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "porcupine": {
    wi_taxon_id: "cb86bb15-bf32-453f-930f-68da02c4b521",
    class: "Mammalia",
    order: "Rodentia",
    family: "Hystricidae",
    genus: "Hystrix",
    species: "cristata",
    common_name: "Crested Porcupine"
  },
  "reedbuck": {
    wi_taxon_id: "e780d2d3-8822-4c68-b031-1970885663c3",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Redunca",
    species: "redunca",
    common_name: "Bohor Reedbuck"
  },
  "reptiles": {
    wi_taxon_id: "739a105e-d883-4ff8-9282-7ec44018e6a0",
    class: "Reptilia",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: "Reptile"
  },
  "rhinoceros": {
    wi_taxon_id: "fa3a7f4a-912a-4ff9-b82c-95b27f3d39fb",
    class: "Mammalia",
    order: "Perissodactyla",
    family: "Rhinocerotidae",
    genus: "Diceros",
    species: "bicornis",
    common_name: "Black Rhinoceros"
  },
  "rodents": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "secretarybird": {
    wi_taxon_id: "62e231a7-567c-4264-a621-4f690ba783a6",
    class: "Aves",
    order: "Accipitriformes",
    family: "Sagittariidae",
    genus: "Sagittarius",
    species: "serpentarius",
    common_name: "Secretarybird"
  },
  "serval": {
    wi_taxon_id: "573c85b2-4dac-406f-bcd2-ab2448fd234c",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Leptailurus",
    species: "serval",
    common_name: "Serval"
  },
  "steenbok": {
    wi_taxon_id: "c582e165-1d76-4520-bea6-f2c516fbb0a2",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Raphicerus",
    species: "campestris",
    common_name: "Steenbok"
  },
  "topi": {
    wi_taxon_id: "3f197683-19cb-46ed-af19-362c4bcc0bfd",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Damaliscus",
    species: "lunatus",
    common_name: "Topi"
  },
  "vulture": {
    wi_taxon_id: "",
    class: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    common_name: ""
  },
  "warthog": {
    wi_taxon_id: "ccd7d6d7-8eb2-4fdb-a6d6-f1970847e449",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Suidae",
    genus: "Phacochoerus",
    species: "africanus",
    common_name: "Common Warthog"
  },
  "waterbuck": {
    wi_taxon_id: "b0f1b993-d62c-4b55-b833-5e575a15df05",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Kobus",
    species: "ellipsiprymnus",
    common_name: "Waterbuck"
  },
  "wildcat": {
    wi_taxon_id: "96debe9f-7452-42c9-87ae-2e6b37f78025",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Felis",
    species: "silvestris",
    common_name: "Wild Cat"
  },
  "wildebeest": {
    wi_taxon_id: "09fbf931-bbf0-4959-9df6-1082db578281",
    class: "Mammalia",
    order: "Cetartiodactyla",
    family: "Bovidae",
    genus: "Connochaetes",
    species: "taurinus",
    common_name: "Common Wildebeest"
  },
  "zebra": {
    wi_taxon_id: "dd39bbd5-077c-482e-9d33-bd176116c870",
    class: "Mammalia",
    order: "Perissodactyla",
    family: "Equidae",
    genus: "Equus",
    species: "quagga",
    common_name: "Plains Zebra"
  },
  "zorilla": {
    wi_taxon_id: "dff1abeb-acb4-4ea0-909b-9b4895f7d88d",
    class: "Mammalia",
    order: "Carnivora",
    family: "Mustelidae",
    genus: "Ictonyx",
    species: "striatus",
    common_name: "Zorilla"
  }
}

export const taxonOptions: CreatableOption[] = Object.keys(taxonMap).map(
  key => ({ label: formatAnimalClassName(key), value: key })
);
