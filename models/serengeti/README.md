# Deep Learning wildlife classifier
<p align="center">
<img src="images_serengeti/S8_R08_R2_IMAG0519.JPG"></img></br>
<em>In this image our model correctly recognizes the Grant's gazelle, a Thomson's gazelle, and the zebras in the back</em>
</p>

In this repo we share the model we have trained and used to obtain 5th place in the <a href="https://www.drivendata.org/competitions/59/camera-trap-serengeti/">Hakuna Ma-data competition</a>.

Try it out yourself!

To play with it you can:
 - clone the repo, and then use the `classify_images` notebook
 - open the `classify_images_on_colab` notebook on Google Colab (you can <a href="https://colab.research.google.com/github/Appsilon/serengeti_try_it_yourself/blob/master/classify_images_on_colab.ipynb">use this link</a>) and enjoy the model without the need to setup the environment (try uploading your own data!)

We have provided a few images from the Snapshot Serengeti project (on which the model was trained), and a sample of fun examples. Let us know if you find something cool or funny!

## Model

The classes our model is trained to recognize are:

aardvark, aardwolf, baboon, bat, batearedfox, buffalo, bushbuck, caracal, cattle, cheetah, civet, dikdik, duiker, eland, elephant, empty, gazellegrants, gazellethomsons, genet, giraffe, guineafowl, hare, hartebeest, hippopotamus, honeybadger, hyenaspotted, hyenastriped, impala, insectspider, jackal, koribustard,leopard, lionfemale, lionmale, mongoose, monkeyvervet, ostrich, otherbird, porcupine, reedbuck, reptiles, rhinoceros, rodents, secretarybird, serval, steenbok, topi,vulture, warthog, waterbuck, wildcat, wildebeest, zebra, zorilla
