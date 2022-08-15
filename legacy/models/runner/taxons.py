from io import StringIO
from pandas import read_csv

# Keep in sync with the data in `app/constants/taxons.ts`.
TAXONS_CSV = '''
label,wi_taxon_id,class,order,family,genus,species,common_name
Bird,,,,,,,
Blank,f1856211-cfb7-4a5b-9158-c0f72fd09ee6,,,,,,Blank
Buffalo_African,9732cefb-6a08-49f6-b61e-b9a9054368c4,Mammalia,Cetartiodactyla,Bovidae,Syncerus,caffer,African Buffalo
Cat_Golden,99516caa-c7ca-41d9-998a-fcc9ee189dae,Mammalia,Carnivora,Felidae,Caracal,aurata,African Golden Cat
Chevrotain_Water,578e82fe-ae7e-4a36-a00d-3ee7779c7899,Mammalia,Cetartiodactyla,Tragulidae,Hyemoschus,aquaticus,Water Chevrotain
Chimpanzee,5ff4999d-7a3c-4ad8-bf3e-3664fd25a71f,Mammalia,Primates,Hominidae,Pan,troglodytes,Chimpanzee
Civet_African_Palm,6a6ef0d0-309a-46cb-b9a1-bca994d0d5ba,Mammalia,Carnivora,Nandiniidae,Nandinia,binotata,African Palm Civet
Duiker_Blue,82401638-0e0c-4f83-a50b-efc7707e3524,Mammalia,Cetartiodactyla,Bovidae,Philantomba,monticola,Blue Duiker
Duiker_Red,3e34492e-b6d2-4db9-925d-301beb639cad,Mammalia,Cetartiodactyla,Bovidae,Cephalophus,,Cephalophus Species
Duiker_Yellow_Backed,3b799133-6737-4df0-bf8b-da20ded02732,Mammalia,Cetartiodactyla,Bovidae,Cephalophus,silvicultor,Yellow-backed Duiker
Elephant_African,a58bbd45-1dcf-46f0-9af6-579869da63ad,Mammalia,Proboscidea,Elephantidae,Loxodonta,,Loxodonta Species
Genet,9e251a37-cef9-4bf9-b876-2ca1279dc613,Mammalia,Carnivora,Viverridae,Genetta,,Genetta Species
Gorilla,d3739ec9-6c1a-4e77-8640-175cde6bf021,Mammalia,Primates,Hominidae,Gorilla,gorilla,Western Gorilla
Guineafowl_Black,fdead9ba-c38d-4e6f-9a41-81f3996d77a0,Aves,Galliformes,Numididae,Agelastes,niger,Black Guineafowl
Guineafowl_Crested,31ef4fb6-290e-43b8-8d1e-aef63eff86f4,Aves,Galliformes,Numididae,Guttera,plumifera,Plumed Guineafowl
Hog_Red_River,9a52e12e-aa3c-4b25-9f1d-13b9d71106e7,Mammalia,Cetartiodactyla,Suidae,Potamochoerus,porcus,Red River Hog
Human,990ae9dd-7a59-4344-afcb-1b7b21368000,Mammalia,Primates,Hominidae,Homo,sapiens,Human
Leopard_African,aa73e0ac-973d-461d-914a-d2fa6e4b98a4,Mammalia,Carnivora,Felidae,Panthera,pardus,Leopard
Mandrillus,77a32c72-279e-40ab-acbc-58bb5d292d47,Mammalia,Primates,Cercopithecidae,Mandrillus,sphinx,Mandrill
Mongoose,,,,,,,
Mongoose_Black_Footed,2e399a80-fdfc-4538-b648-80c6903e0267,Mammalia,Carnivora,Herpestidae,Bdeogale,,Bdeogale Species
Monkey,feb9186e-13c5-4806-8852-5768d3dcde79,Mammalia,Primates,Cercopithecidae,,,Cercopithecidae Family
Pangolin,b1cefdc9-af34-4f28-b077-1186dd6b5072,Mammalia,Pholidota,Manidae,,,Pangolin Family
Porcupine_Brush_Tailed,650f28c6-0c25-4c66-bf85-35a3bd622c75,Mammalia,Rodentia,Hystricidae,Atherurus,africanus,African Brush-tailed Porcupine
Rail_Nkulengu,27b48398-f1bd-4248-8844-b05e468b5634,Aves,Gruiformes,Rallidae,Himantornis,haematopus,Nkulengu Rail
Rat_Giant,699f6d38-8a0d-45e7-a1dc-e41da5794242,Mammalia,Rodentia,Nesomyidae,Cricetomys,emini,Forest Giant Pouched Rat
Rodent,,,,,,,
Squirrel,,,,,,,
aardvark,7a5a9437-883c-4a5b-b7f9-1d90ec457f46,Mammalia,Tubulidentata,Orycteropodidae,Orycteropus,afer,Aardvark
aardwolf,fa0d7796-5b11-450d-b15c-d49fdfe89d0e,Mammalia,Carnivora,Hyaenidae,Proteles,cristata,Aardwolf
baboon,ada5414d-2ce9-4be2-9691-bd8e7695366e,Mammalia,Primates,Cercopithecidae,Papio,anubis,Olive Baboon
bat,,,,,,,
batearedfox,723584af-fbd4-4839-84be-cd89acacc070,Mammalia,Carnivora,Canidae,Otocyon,megalotis,Bat-eared Fox
buffalo,9732cefb-6a08-49f6-b61e-b9a9054368c4,Mammalia,Cetartiodactyla,Bovidae,Syncerus,caffer,African Buffalo
bushbuck,1ae5230b-5168-4491-ad4e-19583eb21b52,Mammalia,Cetartiodactyla,Bovidae,Tragelaphus,scriptus,Bushbuck
caracal,10ade100-b9c0-4e57-b09b-4df4a638e22d,Mammalia,Carnivora,Felidae,Caracal,,Caracal Species
cattle,aca65aaa-8c6d-4b69-94de-842b08b13bd6,Mammalia,Artiodactyla,Bovidae,Bos,taurus,Domestic Cattle
cheetah,5a9b1344-2dd5-4162-9d85-77ee4648ad9c,Mammalia,Carnivora,Felidae,Acinonyx,jubatus,Cheetah
civet,de7c35cc-387c-486d-bcf6-36b9feddcff7,Mammalia,Carnivora,Viverridae,,,Civet Genet Family
dikdik,0d859923-9aae-4510-bfe0-1c066996f5ed,Mammalia,Cetartiodactyla,Bovidae,Madoqua,,Dik-Dik Species
duiker,3e34492e-b6d2-4db9-925d-301beb639cad,Mammalia,Cetartiodactyla,Bovidae,Cephalophus,,Cephalophus Species
eland,6ffe2064-cabd-4fcb-8c1b-f168bf381aab,Mammalia,Cetartiodactyla,Bovidae,Tragelaphus,oryx,Common Eland
elephant,a58bbd45-1dcf-46f0-9af6-579869da63ad,Mammalia,Proboscidea,Elephantidae,Loxodonta,,Loxodonta Species
empty,f1856211-cfb7-4a5b-9158-c0f72fd09ee6,,,,,,Blank
gazellegrants,8c48ed75-e275-4188-a6b1-55929d298e85,Mammalia,Cetartiodactyla,Bovidae,Nanger,granti,Grant's Gazelle
gazellethomsons,dc5dbe17-a8ca-40a6-ac6a-3b6b1d63e6d6,Mammalia,Cetartiodactyla,Bovidae,Eudorcas,thomsonii,Thomson's Gazelle
genet,de7c35cc-387c-486d-bcf6-36b9feddcff7,Mammalia,Carnivora,Viverridae,,,Civet Genet Family
giraffe,2dca052b-dff5-4cc9-8072-1282c5713286,Mammalia,Cetartiodactyla,Giraffidae,Giraffa,camelopardalis,Giraffe
guineafowl,83133617-8358-4910-82ee-4c23e40ba3dc,Aves,Galliformes,Numididae,Numida,meleagris,Helmeted Guineafowl
hare,d07fdf54-b3e5-46da-93a7-65fa5dda1055,Mammalia,Lagomorpha,Leporidae,Lepus,victoriae,African Savanna Hare
hartebeest,a6c4ef9a-d23f-49ca-97c6-4f859df0066e,Mammalia,Cetartiodactyla,Bovidae,Alcelaphus,buselaphus,Hartebeest
hippopotamus,7631afd3-ab8e-4e88-9243-2c21386595eb,Mammalia,Cetartiodactyla,Hippopotamidae,Hippopotamus,amphibius,Hippopotamus
honeybadger,a4f40e31-17f6-45b7-8b9d-e32af92a24df,Mammalia,Carnivora,Mustelidae,Mellivora,capensis,Honey Badger
hyenaspotted,dce8d520-a3f6-4ed7-a434-bfe98f81a03d,Mammalia,Carnivora,Hyaenidae,Crocuta,crocuta,Spotted Hyaena
hyenastriped,2e5b35a8-563f-4372-9f32-cb869448c88a,Mammalia,Carnivora,Hyaenidae,Hyaena,hyaena,Striped Hyaena
impala,c134e0ab-cf96-45ec-bae6-60b94995f71b,Mammalia,Cetartiodactyla,Bovidae,Aepyceros,melampus,Impala
insectspider,9fb844bd-26d1-49f1-a829-0025a48d3bdb,Insecta,,,,,Insect
jackal,152e91ce-cadc-43ef-9d7a-084b7f752ebe,Mammalia,Carnivora,Canidae,Canis,mesomelas,Black-backed Jackal
koribustard,38296099-8b9b-4f18-9615-6d589384b04d,Aves,Otidiformes,Otididae,Ardeotis,kori,Kori Bustard
leopard,aa73e0ac-973d-461d-914a-d2fa6e4b98a4,Mammalia,Carnivora,Felidae,Panthera,pardus,Leopard
lionfemale,ddf59264-185a-4d35-b647-2785792bdf54,Mammalia,Carnivora,Felidae,Panthera,leo,Lion
lionmale,ddf59264-185a-4d35-b647-2785792bdf54,Mammalia,Carnivora,Felidae,Panthera,leo,Lion
mongoose,,,,,,,
monkeyvervet,0c72ac0d-6ed4-40f4-90ba-215dd1a7de8e,Mammalia,Primates,Cercopithecidae,Chlorocebus,pygerythrus,Vervet Monkey
ostrich,e2cbac0d-b4aa-4875-adc2-b1276c9276d3,Aves,Struthioniformes,Struthionidae,Struthio,camelus,Common Ostrich
otherbird,,,,,,,
porcupine,cb86bb15-bf32-453f-930f-68da02c4b521,Mammalia,Rodentia,Hystricidae,Hystrix,cristata,Crested Porcupine
reedbuck,e780d2d3-8822-4c68-b031-1970885663c3,Mammalia,Cetartiodactyla,Bovidae,Redunca,redunca,Bohor Reedbuck
reptiles,739a105e-d883-4ff8-9282-7ec44018e6a0,Reptilia,,,,,Reptile
rhinoceros,fa3a7f4a-912a-4ff9-b82c-95b27f3d39fb,Mammalia,Perissodactyla,Rhinocerotidae,Diceros,bicornis,Black Rhinoceros
rodents,,,,,,,
secretarybird,62e231a7-567c-4264-a621-4f690ba783a6,Aves,Accipitriformes,Sagittariidae,Sagittarius,serpentarius,Secretarybird
serval,573c85b2-4dac-406f-bcd2-ab2448fd234c,Mammalia,Carnivora,Felidae,Leptailurus,serval,Serval
steenbok,c582e165-1d76-4520-bea6-f2c516fbb0a2,Mammalia,Cetartiodactyla,Bovidae,Raphicerus,campestris,Steenbok
topi,3f197683-19cb-46ed-af19-362c4bcc0bfd,Mammalia,Cetartiodactyla,Bovidae,Damaliscus,lunatus,Topi
vulture,,,,,,,
warthog,ccd7d6d7-8eb2-4fdb-a6d6-f1970847e449,Mammalia,Cetartiodactyla,Suidae,Phacochoerus,africanus,Common Warthog
waterbuck,b0f1b993-d62c-4b55-b833-5e575a15df05,Mammalia,Cetartiodactyla,Bovidae,Kobus,ellipsiprymnus,Waterbuck
wildcat,96debe9f-7452-42c9-87ae-2e6b37f78025,Mammalia,Carnivora,Felidae,Felis,silvestris,Wild Cat
wildebeest,09fbf931-bbf0-4959-9df6-1082db578281,Mammalia,Cetartiodactyla,Bovidae,Connochaetes,taurinus,Common Wildebeest
zebra,dd39bbd5-077c-482e-9d33-bd176116c870,Mammalia,Perissodactyla,Equidae,Equus,quagga,Plains Zebra
zorilla,dff1abeb-acb4-4ea0-909b-9b4895f7d88d,Mammalia,Carnivora,Mustelidae,Ictonyx,striatus,Zorilla
'''

def taxons_df():
    return read_csv(StringIO(TAXONS_CSV))
