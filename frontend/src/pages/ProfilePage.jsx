import { useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../Modal/Modal";

function ProfilePage() {
  const authenticated = true;
  const [modalOpen, setModalOpen] = useState(false);

 

  return (
    <div>
      <Navbar authenticated={authenticated} />
      <div>ProfilePage</div>
      <button
        className="openModalBtn"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Open
      </button>

      {modalOpen && <Modal setOpenModal={setModalOpen} />}
    </div>
  );
}

export default ProfilePage;
