---
layout: post
title: How to use Diffusion Models for Data Augmentations
---

![header.png](/public/images/posts/2023-08-28-diffusion-augmentations/header.png)


Data augmentations are an essential part of training any Deep Learning algorithm. There are numerous options to choose from, such as flips, color jittering, MixUps, crops, and more. However, in the era of modern Machine Learning, we can explore the use of Generative AI for augmentations.

In this article, we will look into relevant research papers and benchmarks, compare various approaches, and determine whether diffusion models are effective tools for data augmentation.

## Approaches to Data Augmentation with Diffusion Models

Data augmentation is a technique that helps reducing overfitting by enhancing our dataset with modified versions of existing samples. For instance, when training an image classification model, we can apply random horizontal flips to each sample during the training process. Let's explore which techniques can be employed to enable data augmentation with diffusion models.

### Boomerang

In the paper titled “[Boomerang: Local sampling on image manifolds using diffusion models](https://arxiv.org/pdf/2210.12100.pdf)”, researchers use Stable Diffusion to make small changes to each dataset sample. They apply img2img with a limited number of diffusion steps, resulting in images that appeared similar but were actually different. Let's take a look at an example.

![Images looks kind of the same, but details are slightly different](/public/images/posts/2023-08-28-diffusion-augmentations/diffusion.png)

The paper reports increased accuracy on CIFAR-10 and ImageNet-200 datasets. However, it's not entirely clear from the paper what augmentations were used for the baseline, thus making the results less representative. In this article, we will explore another paper that compares Boomerang with other approaches.

### Prompt Conditioning

This method involves generating images of the required class using Stable Diffusion. We can condition the model using prompts that include the name of the class. For instance, prompts like "a photo of the n" or "a HQ image of the n" can be used. Additionally, instead of using the vanilla Stable Diffusion 1.5, we can use a fine-tuned version, which may yield more photorealistic results. For the images presented below, I used fine-tune [Deliberate](https://huggingface.co/XpucT/Deliberate).

![prompt: a photo of the leopard](/public/images/posts/2023-08-28-diffusion-augmentations/leopard1.png)

`prompt: a photo of the leopard`

![prompt: a HQ image of the leopard](/public/images/posts/2023-08-28-diffusion-augmentations/leopard2.png)

`prompt: a HQ image of the leopard`

### Textual Inversion

Textual Inversion is a technique that allows us to teach a diffusion model novel concepts using only a small number of example images. The concept was introduced in the paper “[An Image is Worth One Word](https://arxiv.org/pdf/2208.01618.pdf)”. With this approach, we teach SD models on concepts from our own dataset. This becomes particularly valuable when our domain is not properly represented in the datasets on which SD was initially trained. For example, if we are training a model to classify various types of furniture or exotic flowers, Textual Inversion can help us in achieving better results.

![Image from the HuggingFace diffusers [Textual Inversion documentation](https://huggingface.co/docs/diffusers/training/text_inversion)](/public/images/posts/2023-08-28-diffusion-augmentations/textual_inversion.png)


The downside is that we need to train textual inversion for every concept in our dataset. For large datasets like ImageNet, which can contain thousands of concepts, this approach can become time and resource-consuming.

Also, we can fine-tune the entire model on our images, or we can fine-tune just the text encoder, which, in the case of SD, is CLIP. However, these techniques suffer from the same problems.

## Comparison

For the comparison, we will use data from the amazing paper "[A data augmentation perspective on diffusion models and retrieval.](https://arxiv.org/pdf/2304.10253.pdf)" I highly encourage you to read this paper, as it provides a nice overview of the field.

### Baseline

To simulate the training pipeline when training data is scarce, the authors sampled only 10% of the ImageNet-1000 dataset.

### Upper-bound Model

To establish an upper-bound model, they used the same training routine but with 20% of the ImageNet-1000 dataset. This allows us to compare not only how diffusion augmentations perform compared to the baseline, but also to compare the results of diffusion augmentations to the model that has more real-world data.

### Nearest Neighbor Retrieval

We can retrieve samples from the Stable Diffusion training dataset, Laion 5B. We can do this based on their CLIP similarity to the classes from ImageNet-1000. This way, we will be able to see if it is reasonable to use Stable Diffusion for augmentations, or if it is better to retrieve data from the Stable Diffusion training dataset. For your projects, you can use [tools](https://rom1504.github.io/clip-retrieval/?back=https%3A%2F%2Fknn.laion.ai&index=laion5B-H-14&useMclip=false) that simplify the process of CLIP retrieval.

The authors evaluated the entire ImageNet validation split. They applied random resizing and cropping augmentations to each method mentioned above. The baseline model utilized a ResNet-50 classifier trained on this data. For each method, they used the original 10% of the ImageNet as the training data and supplemented it with additional augmented data. The diffusion augmentations were performed using Stable Diffusion 1.4.

Let’s dig into the results.

| Augmentation method | Top-1 accuracy (%) |
| --- | --- |
| 10% ImageNet | 57.2 ± 0.2 |
| 20% ImageNet | 70.2 ± 0.3 |
| Boomerang | 56.3 ± 0.3 |
| Prompt Conditioning (CLIP prompts) | 60.9 ± 0.2 |
| Textual Inversion | 61.0 ± 0.4 |
| Nearest Neighbor Retrieval | 62.6 ± 0.1 |

As expected, the model trained with 20% of ImageNet performed the best. It proves that it is always better to collect more real-world data. Interestingly, Bommerang performed poorly, even worse than the model trained on 10% of ImageNet. My guess is that this is because Bommerang doesn't significantly change the data, which could lead to overfitting. Below, you can see how little information changed in the images.

![Image from the “[A data augmentation perspective on diffusion models and retrieval](https://arxiv.org/pdf/2304.10253.pdf)” paper](/public/images/posts/2023-08-28-diffusion-augmentations/boomerang.png)

Maybe if authors applied more diffusion steps and combined this with Prompt Conditioning, it would yield better results.

The most interesting thing from the paper is that Nearest Neighbor Retrieval gives the best result among all discussed techniques except for 20% ImageNet-1000. And, once again, it proves that real-world data rocks. And that the CLIP retrieval is a quite powerful technique.

An important thing to mention in this article is that the authors used Stable Diffusion 1.4 for their experiments. However, at the time of this writing, SD 1.5 and 2.1 are already available, and the release of SDXL 1.0 is [just](https://stability.ai/blog/sdxl-09-stable-diffusion) around the corner. The generation quality of these newer models is significantly better than SD 1.4. Considering this progress, it is likely that in the upcoming months, we will see new research papers that more successfully utilize diffusion models for augmentations or even zero-shot tasks.

## Conclusion

Using diffusion models is a beneficial way to enrich your data, particularly in tricky cases where Textual Inversion or similar techniques can be applied. However, it is even more advantageous to obtain additional real-world data. To achieve this, you can leverage CLIP and utilize a large-scale dataset, such as Laion-5B.