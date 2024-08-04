"use client";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchLoader, setFetchLoader] = useState("");
  const [addLoader, setAddLoader] = useState("");
  const [deleteLoader, setDeleteLoader] = useState("");

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");

  const updatePantry = async () => {
    setFetchLoader("Fetching List...");
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
    setFetchLoader("");
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    setAddLoader("Adding Item...");
    const itemInLowercase = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), itemInLowercase);
    // Check if exist
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
    setAddLoader("");
  };

  const removeItem = async (item) => {
    setDeleteLoader("Deleting Item...");
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
    setDeleteLoader("");
  };
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!fetchLoader || !!addLoader || !!deleteLoader}
      >
        <CircularProgress color="inherit" />
        {fetchLoader && <p>{fetchLoader}</p>}
        {addLoader && <p>{addLoader}</p>}
        {deleteLoader && <p>{deleteLoader}</p>}
      </Backdrop>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>
      <OutlinedInput
        type="text"
        value={searchTerm}
        placeholder="Search Item"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* {addLoader && <p>{addLoader}</p>} */}

      <Box border={"2px solid #333"}>
        <Box
          width="1000px"
          height="100px"
          bgcolor={"#33a5ff"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="1000px" height="500px" spacing={2} overflow={"auto"}>
          {/* {fetchLoader && <p>{fetchLoader}</p>}
          {deleteLoader && <p>{deleteLoader}</p>} */}
          {filteredPantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#33ff8d"}
              paddingX={5}
            >
              <Typography
                variant={"h3"}
                color={"#333"}
                textAlign={"center"}
                textTransform={"capitalize"}
              >
                {
                  // Capitalise the first letter of the item
                  // name.charAt(0).toUpperCase() + name.slice(1)
                  name
                }
              </Typography>

              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                Quantity: {count}
              </Typography>
              <Box
                width="140px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Button variant="contained" onClick={() => addItem(name)}>
                  +
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  _
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
