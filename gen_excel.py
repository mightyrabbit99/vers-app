import openpyxl


class Plant:
    name: str


class Sector:
    plant_name: str
    name: str


class Subsector:
    sector_name: str
    name: str


class Skill:
    subsec_name: str


class Department:
    name: str


class SkillLevel:
    skill_name: str
    level: int


class Employee:
    dept_name: str
    subsec_name: str
    first_name: str
    last_name: str
    skills: list[SkillLevel]


class Job:
    title: str
    skills: list[SkillLevel]
    emps: list[Employee]


class Forecast:
    n: int
    val: float


class ForecastPack:
    name: str
    on: str
    forecasts: list[Forecast]


def gen_plant_excel(plants: list[Plant]):
    return


def gen_sector_excel(sectors: list[Sector]):
    return


def gen_subsec_excel(subsecs: list[Subsector]):
    return


def gen_skill_excel(skills: list[Skill]):
    return


def gen_employee_excel(emps: list[Employee]):
    return


def gen_job_excel(jobs: list[Job]):
    return


def gen_forecast_pack_excel(forecasts: list[ForecastPack]):
    return


def main():
    return


if __name__ == '__main__':
    main()
