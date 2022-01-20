import {
  Box,
  Divider,
  Flex,
  FormControl,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { CustomInput, CustomTextArea } from "../components/CustomInput";
import { DangerButton } from "../components/DangerButton";
import firebase from "../firebase/config";
import {
  AddMulitplePhotos,
  MainUploadComp,
} from "../components/UploadComponents";
import { LightButton } from "../components/LightButton";
import { CreateProperty } from "../firebase/firestore";

const BrickandCondoUpload = () => {
  //Fake Data, this should be implemented by getting the actual files.
  const [currentUpload, setCurrentUpload] = React.useState("");
  const [mainImageUploadURL, setMainImageUploadURL] = React.useState("");
  const [otherImagesUploadURL, setOtherImagesUploadURL] = React.useState();
  const [otherImagesUploadName, setOtherImagesUploadName] = React.useState("");
  const [mainImageUploadName, setMainImageUploadName] = React.useState("");
  const [subImageOneUploadURL, setSubImageOneUploadURL] = React.useState("");
  const [subImageOneUploadName, setSubImageOneUploadName] = React.useState("");
  const [subImageTwoUploadURL, setSubImageTwoUploadURL] = React.useState("");
  const [subImageTwoUploadName, setSubImageTwoUploadName] = React.useState("");
  const [bathroom, setBathroom] = React.useState("");
  const [rooms, setRooms] = React.useState("");
  const [square_foot, setSquareFoot] = React.useState("");
  const [property_name, setPropertyName] = React.useState("");
  const [property_location, setPropertyLocation] = React.useState("");
  const [property_sublocation, setPropertySubLocation] = React.useState("");
  const [property_description, setPropertyDescription] = React.useState("");
  const [one_time_payment_naira, setOneTimePaymentNaira] = React.useState();
  const [rental_value_naira, setRentalValueNaira] = React.useState();
  const [one_time_payment_dollar, setOneTimePaymentDollar] = React.useState();
  const [rental_value_dollar, setRentalValueDollar] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);

  const [id] = React.useState(Date.now());

  const OtherImages = ["ImageOne", "ImageTwo", "Image3"];
  const onUploadImage = async (e: any, anchor: string) => {
    const selectedFile = e.target.files[0];
    selectedFile && setIsLoading(true);
    switch (anchor) {
      case "main":
        setCurrentUpload(selectedFile.name);
        setMainImageUploadName(selectedFile.name);
        fetchImageUrl(selectedFile, `${id}`, "main");
        break;
      case "subImageOne":
        setCurrentUpload(selectedFile.name);
        setSubImageOneUploadName(selectedFile.name);
        fetchImageUrl(selectedFile, `${id}`, "subImageOne");
        break;
      case "subImageTwo":
        setCurrentUpload(selectedFile.name);
        setSubImageTwoUploadName(selectedFile.name);
        fetchImageUrl(selectedFile, `${id}`, "subImageTwo");
        break;
      case "otherImages":
        setCurrentUpload(selectedFile.name);
        setOtherImagesUploadName(selectedFile.name);
        fetchImageUrl(selectedFile, `${id}`, "otherImages");
        break;
      default:
        break;
    }
  };
  const fetchImageUrl = async (
    selectedFile: any,
    dest: string,
    anchor: string
  ) => {
    const storageRef = firebase
      .storage()
      .ref(`properties/${dest}/${anchor}/${selectedFile}`);
    const uploadTask = storageRef.put(selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // get the uploaded image url back
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          switch (anchor) {
            case "main":
              setMainImageUploadURL(downloadURL);
              break;
            case "subImageOne":
              setSubImageOneUploadURL(downloadURL);
              break;
            case "subImageTwo":
              setSubImageTwoUploadURL(downloadURL);
              break;
            case "otherImages":
              // const imgs: [any, any] = [...otherImagesUploadURL, downloadURL];
              // setOtherImagesUploadURL(imgs);
              break;
            default:
              break;
          }
          setIsLoading(false);
        });
      }
    );
  };
  const cleanUp = () => {
    setCreateLoading(false);
  };
  const onCreateProperty = async () => {
    const propertyData = {
      id,
      bathroom,
      rooms,
      square_foot,
      images: {
        main: mainImageUploadURL,
        sub_image_one: subImageOneUploadURL,
        sub_image_two: subImageTwoUploadURL,
        other_images: otherImagesUploadURL || "",
      },
      property_name,
      property_location,
      property_sublocation,
      property_description,
      one_time_payment_naira: one_time_payment_naira || 0,
      rental_value_naira: rental_value_naira || 0,
      one_time_payment_dollar: one_time_payment_dollar || 0,
      rental_value_dollar: rental_value_dollar || 0,
    };
    setCreateLoading(true);
    CreateProperty(propertyData, cleanUp);
  };
  return (
    <Box>
      <Heading
        fontFamily="ProductBold"
        fontSize={{ lg: "30px" }}
        color="primary.300"
      >
        Upload a new property{" "}
        {isLoading && (
          <Box>
            <DangerButton>Uploading {currentUpload}</DangerButton>
          </Box>
        )}
      </Heading>
      <Box my="8">
        <Grid gap="8" gridTemplateColumns={{ lg: "7fr 3fr" }}>
          <Box>
            <MainUploadComp
              text={mainImageUploadName || "Upload Main Image"}
              onChange={
                isLoading
                  ? () => {}
                  : (e: any) => {
                      onUploadImage(e, "main");
                    }
              }
            />
          </Box>
          <Flex gap="8" direction="column">
            <MainUploadComp
              text={subImageOneUploadName || "Upload Sub Image"}
              onChange={
                isLoading
                  ? () => {}
                  : (e: any) => {
                      onUploadImage(e, "subImageOne");
                    }
              }
            />
            <MainUploadComp
              text={subImageTwoUploadName || "Upload Sub Image"}
              onChange={
                isLoading
                  ? () => {}
                  : (e: any) => {
                      onUploadImage(e, "subImageTwo");
                    }
              }
            />
          </Flex>
        </Grid>
      </Box>
      <AddMulitplePhotos
        text={otherImagesUploadName || "Add other images"}
        onChange={
          isLoading
            ? () => {}
            : (e: any) => {
                onUploadImage(e, "otherImages");
              }
        }
      />
      <Flex align="center" gap={{ lg: 4 }}>
        <Flex gap={{ lg: 4, base: 10 }} my="4">
          {OtherImages.map((item, index) => {
            return (
              <Text key={index} fontFamily="ProductBold" color="primary.300">
                {item}
              </Text>
            );
          })}
        </Flex>
      </Flex>
      <Box>
        <DangerButton>Clear</DangerButton>
      </Box>

      <Flex direction="column" my="10">
        <Heading
          fontSize={{ lg: "25px" }}
          fontFamily="ProductBold"
          color="secondary.100"
        >
          Property Meta Data
        </Heading>

        <Flex
          mt="10"
          w="fit-content"
          gap={{ lg: 4 }}
          direction={{ lg: "row", base: "column" }}
        >
          <CustomInput
            type="number"
            id="BathNum"
            label="How many Baths?"
            onChange={
              isLoading
                ? () => {}
                : (e: any) => {
                    setBathroom(e.target.value);
                  }
            }
          />
          <CustomInput
            type="number"
            id="RoomNum"
            label="How many Rooms?"
            onChange={
              isLoading
                ? () => {}
                : (e: any) => {
                    setRooms(e.target.value);
                  }
            }
          />
          <CustomInput
            type="number"
            id="BathText"
            label="Total Square foot"
            onChange={
              isLoading
                ? () => {}
                : (e: any) => {
                    setSquareFoot(e.target.value);
                  }
            }
          />
        </Flex>
      </Flex>
      <Divider mt={{ lg: "8" }} colorScheme="secondary" />
      <Flex direction="column" my="10">
        <Heading
          fontSize={{ lg: "25px" }}
          mb={{ base: "4" }}
          fontFamily="ProductBold"
          color="secondary.100"
        >
          Property Main Data
        </Heading>

        <Flex
          gap={{ lg: 4, base: 10 }}
          direction={{ lg: "row", base: "column" }}
        >
          <Box w={{ lg: "80%", base: "100%" }} my={{ lg: 4 }}>
            <Flex direction="column" gap={{ lg: 4, base: 6 }}>
              <CustomInput
                type="text"
                id="propertyName"
                label="Property Name"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setPropertyName(e.target.value);
                      }
                }
              />
              <CustomInput
                type="text"
                id="propertySubLocation"
                label="Property SubLocation"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setPropertySubLocation(e.target.value);
                      }
                }
              />
              <CustomInput
                type="text"
                id="propertyLocation"
                label="Property Location"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setPropertyLocation(e.target.value);
                      }
                }
              />
              <CustomTextArea
                type="text"
                id="DescriptionData"
                label={`Property's Description`}
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setPropertyDescription(e.target.value);
                      }
                }
              />
            </Flex>
          </Box>
          <Box w={{ lg: "20%", base: "100%" }} my={{ lg: 4 }}>
            <Flex direction="column" gap={{ lg: "4" }} h={{ lg: "100%" }}>
              <CustomInput
                type="number"
                id="oneTimePaymentNaira"
                label="One Time Payment- Naira"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setOneTimePaymentNaira(e.target.value);
                      }
                }
              />
              <CustomInput
                type="number"
                id="rentalValueNaira"
                label="Rental Value- Naira"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setRentalValueNaira(e.target.value);
                      }
                }
              />
              <CustomInput
                type="number"
                id="oneTimePaymentDollar"
                label="One Time Payment- Dollar"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setOneTimePaymentDollar(e.target.value);
                      }
                }
              />
              <CustomInput
                type="number"
                id="rentalValueDollar"
                label="Rental Value- Dollar"
                onChange={
                  isLoading
                    ? () => {}
                    : (e: any) => {
                        setRentalValueDollar(e.target.value);
                      }
                }
              />
            </Flex>
          </Box>
        </Flex>
        <Box w={{ lg: "40%" }} mt={{ base: 4 }}>
          <LightButton onClick={createLoading ? () => {} : onCreateProperty}>
            {createLoading ? "Uploading..." : "Upload Property"}
          </LightButton>
        </Box>
      </Flex>
    </Box>
  );
};

export default BrickandCondoUpload;