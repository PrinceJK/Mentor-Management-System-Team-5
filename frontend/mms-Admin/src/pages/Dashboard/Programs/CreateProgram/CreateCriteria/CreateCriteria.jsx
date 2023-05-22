import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import styles from "./CreateCriteria.module.scss";
import { useNavigate } from "react-router-dom";
import backIcon from "@/assets/icons/back-icon.svg";
import Button from "@/components/Button/Button";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createProgramCriteriaSchema } from "@/helpers/validation";
import { showModal } from "@/redux/Modal/ModalSlice";
import SuccessNotificationModal from "@/components/Modals/SuccessNotification/SuccessNotification";
import CriteriaTypesModal from "@/components/Modals/CriteriaTypes/CriteriaTypes";
import SingleInputModal from "@/components/Modals/CriteriaTypes/SingleInput/SingleInput";
import MultipleInputModal from "@/components/Modals/CriteriaTypes/MultipleInput/MultipleInput";
import YesOrNoModal from "@/components/Modals/CriteriaTypes/YesOrNo/YesOrNo";
import MultiChoiceModal from "@/components/Modals/CriteriaTypes/MultiChoice/MultiChoice";
import FileInputModal from "@/components/Modals/CriteriaTypes/FileInput/FileInput";
import { getCriteriaFromStorage } from "@/redux/Criteria/CriteriaSlice";

// import successImage from "@/assets/images/default-success-notification-image.png";

const CreateCriteria = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const criteriaData = useSelector((state) => state?.criteria?.getCriteriaFromStorageData);

  console.log(criteriaData, "criteriaData");

  const [displayInstructions, setDisplayInstructions] = useState(true);
  const [disableBtn, setDisableBtn] = useState({
    createCriteria: true,
    addCriteria: true
  });

  const displayModal = useSelector((state) => state.modal.show);
  const modalName = useSelector((state) => state.modal.modalName);

  useEffect(() => {
    dispatch(getCriteriaFromStorage());
  }, [dispatch]);

  const handleDisplayInstructions = () => {
    setDisplayInstructions(false);
    setDisableBtn({ ...disableBtn, addCriteria: false });
  };

  const resolver = yupResolver(createProgramCriteriaSchema);

  const defaultValues = {
    title: "",
    details: ""
  };

  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm({ defaultValues, resolver, mode: "all" });

  const handleCreateCriteria = (data) => {
    console.log(data, "form data");
    // dispatch(
    //   showModal({
    //     name: "successNotification",
    //     modalData: {
    //       title: "Criteria Created Successfully!",
    //       image: successImage
    //     }
    //   })
    // );
  };

  const displayCriteriaTypes = (e) => {
    e.preventDefault();

    dispatch(
      showModal({
        name: "criteriaTypes",
        modalData: {
          title: "Select Input Type"
        }
      })
    );
  };

  return (
    <div className={cx(styles.createCriteriaContainer, "flexCol")}>
      <div className={cx(styles.heading, "flexRow-align-center")}>
        <img onClick={() => navigate(-1)} src={backIcon} className={cx(styles.backIcon)} alt='close-icon' />
        <h3 className={cx(styles.title)}>Criteria Setup</h3>
      </div>
      <div className={cx(styles.body, "flexCol")}>
        {displayInstructions ? (
          <div className={cx(styles.instructions, "flexCol")}>
            <p>
              To be accepted as a mentor or a mentor manager, an applicant must provide relevant information and
              documents regarding their past experience(s). The criteria setup lets you create input fields for these
              information.
            </p>
            <Button onClick={() => handleDisplayInstructions()} title='Ok' type='primary' size='small' />
          </div>
        ) : (
          <form
            className={cx(styles.formContainer, "flexCol")}
            onSubmit={handleSubmit((data) => handleCreateCriteria(data))}
          >
            <div className={cx(styles.formBody, "flexCol")}>
              <div className={cx(styles.contentWrapper, "flexCol")}>
                {criteriaData &&
                  Object.keys(criteriaData) &&
                  Object.keys(criteriaData).map((category) => {
                    return criteriaData[category].map((item, index) => {
                      return (
                        <div key={index} className={cx(styles.criteriaCard, "flexCol")}>
                          <p>{item.question}</p>
                        </div>
                      );
                    });
                  })}
              </div>
              <div className={cx(styles.addCriteriaBtnDiv, "flexRow")}>
                <Button
                  onClick={(e) => displayCriteriaTypes(e)}
                  title='Add Criteria'
                  type='primary'
                  size='small'
                  disabled={disableBtn.addCriteria}
                />
              </div>
              <div className={cx(styles.submitBtnDiv, "flexRow")}>
                <Button
                  onClick={handleSubmit((data) => handleCreateCriteria(data))}
                  // loading={loading}
                  title='Create Criteria'
                  type='primary'
                  disabled={disableBtn.createCriteria}
                />
              </div>
            </div>
          </form>
        )}
      </div>

      {displayModal && modalName === "successNotification" ? <SuccessNotificationModal show size='lg' /> : null}
      {displayModal && modalName === "criteriaTypes" ? <CriteriaTypesModal show size='lg' /> : null}
      {displayModal && modalName === "singleInput" ? <SingleInputModal show size='lg' /> : null}
      {displayModal && modalName === "multipleInput" ? <MultipleInputModal show size='lg' /> : null}
      {displayModal && modalName === "yesOrNo" ? <YesOrNoModal show size='lg' /> : null}
      {displayModal && modalName === "multiChoice" ? <MultiChoiceModal show size='lg' /> : null}
      {displayModal && modalName === "fileInput" ? <FileInputModal show size='lg' /> : null}
    </div>
  );
};

export default CreateCriteria;
