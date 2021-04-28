import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Skill, Subsector, Sector } from "src/kernel";
import SkillMainList from "./lists/SkillMainList";
import MyDialog from "./commons/Dialog";
import SkillForm from "./forms/SkillForm";
import ListWidget from "./ListWidget";
import { skillExcelUrl } from "src/kernel/Fetcher";
import { toRegExp } from "src/utils/tools";
import { ViewContext } from "src/contexts";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  title: {
    height: "15%",
  },
  content: {
    height: "85%",
  },
  form: {
    maxWidth: "60vw",
    width: 600,
    minWidth: 300,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
    width: "fit-content",
  },
}));

interface ISkillListWidgetProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  sectorLst: { [id: number]: Sector };
  newSkill?: Skill;
  feedback?: any;
  edit?: boolean;
  onSubmit: (s: Skill) => void;
  onDelete: (...s: Skill[]) => void;
  onReset: () => void;
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
}

const SkillListWidget: React.FC<ISkillListWidgetProps> = (props) => {
  const classes = useStyles();
  const {
    lst: l,
    subsectorLst,
    sectorLst,
    newSkill,
    feedback,
    edit = true,
    onSubmit,
    onDelete,
    onReset,
    uploadExcel,
    downloadExcel,
  } = props;

  const [lst, setLst] = React.useState(l);
  const [searchTerm, setSearchTerm] = React.useState("");
  React.useEffect(() => {
    if (searchTerm === "") {
      setLst(l);
    } else {
      const reg = toRegExp(searchTerm);
      setLst(
        Object.fromEntries(
          Object.entries(l).filter(([x, y]) => reg.test(y.name))
        )
      );
    }
  }, [l, searchTerm]);

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

  const [selected, setSelected] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelected([]);
  }, []);
  const handleDeleteOnClick = () => {
    onDelete(...selected.map((x) => lst[x]));
    setSelected([]);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Skill>();
  React.useEffect(() => {
    setFormData((formData) => formData ?? newSkill);
  }, [newSkill]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Skill) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    onReset();
  };

  const handleCreateOnClick = () => {
    setFormData(newSkill);
    setFormOpen(true);
  };

  return (
    <ListWidget
      title="Skills"
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadExcel={downloadExcel}
      uploadExcel={uploadExcel}
      searchOnChange={handleFilter}
      excelTemplateUrl={skillExcelUrl}
    >
      <ViewContext.Consumer>
        {({ viewWidth }) => {
          return (
            <SkillMainList
              lst={lst}
              subsectorLst={subsectorLst}
              sectorLst={sectorLst}
              selected={selected}
              selectedOnChange={setSelected}
              onEdit={edit ? handleEditOnClick : undefined}
              width={viewWidth}
            />
          );
        }}
      </ViewContext.Consumer>
      <MyDialog open={formOpen} onClose={handleFormClose}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              {formData && formData.id === -1
                ? "Create New Skill"
                : "Edit Skill"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <SkillForm
                data={formData}
                subsectorLst={subsectorLst}
                feedback={feedback}
                onSubmit={handleSubmit}
                onCancel={handleFormClose}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
    </ListWidget>
  );
};

export default SkillListWidget;
