import json
import re
from pathlib import Path

mappings = {
    "KinesiologyBldng21(002).jpg": "Kinesiology_Building_2021_002.jpg",
    "UMCampusSnow22(21).jpg": "UM_Campus_Snow_2022_021.jpg",
    "Stock_SumrStudents29Jul21_110.jpg": "Summer_Students_July29_2021_110.jpg",
    "Stock_FallMisc21_053.jpg": "Fall_Misc_2021_053.jpg",
    "Stock_SocialFallcolors21_026.jpg": "Social_Fall_Colors_2021_026.jpg",
    "LSA-WelcomeBkPicnic21(106).jpg": "LSA_Welcome_Back_Picnic_2021_106.jpg",
    "Stock_SnowFeb21_022.jpg": "Snow_February_2021_022.jpg",
    "CampusAerials_eb(248).jpg": "Campus_Aerial_EB_248.jpg",
    "UMStockMisc2Dec21_005.jpg": "UM_Stock_Misc2_December_2021_005.jpg",
    "Stock_SnowdayJan23_079.jpg": "Snow_Day_January_2023_079.jpg",
    "UMCampusStock2-20(148).jpg": "UM_Campus_Stock2_2020_148.jpg",
    "Stock_SnowFeb21_020.jpg": "Snow_February_2021_020.jpg",
    "Stock_FallMisc21_051.jpg": "Fall_Misc_2021_051.jpg",
    "Stock_SnowdayJan23_124.jpg": "Snow_Day_January_2023_124.jpg",
    "TrotterExterior19(030).jpg": "Trotter_Exterior_2019_030.jpg",
    "UMCampusMiscStock17(066).jpg": "UM_Campus_Misc_Stock17_066.jpg",
    "UM-MiscStock18(060)1.jpg": "UM_Misc_Stock18_060_1.jpg",
    "UMCampusMiscStock22_SS_220.jpg": "UM_Campus_Misc_Stock22_SS_220.jpg",
    "Stock_SumrStudentsJul21_106.jpg": "Summer_Students_July_2021_106.jpg",
    "Stock_SnowFeb21_019.jpg": "Snow_February_2021_019.jpg",
    "Stock_FallMisc21_097.jpg": "Fall_Misc_2021_097.jpg",
    "Stock_SocialFallcolors21_008.jpg": "Social_Fall_Colors_2021_008.jpg",
    "Stock_SnowFeb21_030.jpg": "Snow_February_2021_030.jpg",
    "BCTNSpiritDt17(071).jpg": "Spirit_Day_BCTN_2017_071.jpg",
    "Stock_SumrStudents29Jul21_076.jpg": "Summer_Students_July29_2021_076.jpg",
    "SnowStock16Feb21(027).jpg": "Snow_Stock_February16_2021_027.jpg",
    "FBL22_Maryland_361.jpg": "Football_Homecoming_Maryland_2022_09-24_Win34-27_361.jpg",
    "Stock_SnowdayJan23_123.jpg": "Snow_Day_January_2023_123.jpg",
    "UMS19-DenisMatsuev(046).jpg": "Denis_Matsuev_UMS19_046.jpg",
    "CampusAerials20(372).jpg": "Campus_Aerial_2020_372.jpg",
    "DedCrmnyBSBNatHistMsm(087).jpg": "Dedication_Cemetery_BSB_Nat_Hist_Museum_087.jpg",
    "CampusAerials20(299).jpg": "Campus_Aerial_2020_299.jpg",
    "CampusAerials20(338).jpg": "Campus_Aerial_2020_338.jpg",
    "UMCampusStock1-20(86).jpg": "LSA_Building_with_Cube_2020_07-28_086.jpg",
    "UM-MiscStock18(039)1.jpg": "UM_Misc_Stock18_039_1.jpg",
    "UMCampusSnow22(11).jpg": "UM_Campus_Snow_2022_011.jpg",
    "UMCampusMiscStock22_SS_085.jpg": "Frankel_Detroit_Observatory_2022_08-18_085.jpg",
    "FBL18-Indiana-eb(236).jpg": "Football_Senior_Day_Indiana_2018_11-17_Win31-20_236.jpg",
    "RuthvenFeb22(01).jpg": "Ruthven_February_2022_01.jpg",
    "BioMedRsrch-Panel19(059).jpg": "BioMed_Research_Panel19_059.jpg",
    "NCmornJun15(01).jpg": "North_Campus_Morning_June15_01.jpg",
    "UMS-VictorsArtsGala18(119).jpg": "UMS_Victors_Arts_Gala_2018_119.jpg",
    "LurieTower20AnnvCelb16(097).jpg": "Lurie_Tower_20th_Anniversary_2016_10-20_097.jpg",
    "UMCampusStock2-20(06).jpg": "UM_Campus_Stock2_2020_006.jpg",
    "UMCampusStock1-20(236).jpg": "UM_Campus_Stock1_2020_236.jpg",
    "UMCampusMiscStock22_SS_268.jpg": "Ross_School_of_Business_2022_11-03_268.jpg",
    "UMCampusMiscStock22(112).jpg": "UM_Campus_Misc_Stock22_112.jpg",
    "BKW11-DetroitMercy(003).jpg": "Detroit_Mercy_BKW_003.jpg",
    "GGBrownBldgSun15(026).jpg": "GGBrown_Building_Sun_2015_026.jpg",
    "UMCampusStock1-20(164)A.jpg": "UM_Campus_Stock1_2020_164_A.jpg",
    "Stock_SumrStudents29Jul21_002.jpg": "Summer_Students_July29_2021_002.jpg",
    "SchembechlerHall(31).jpg": "Schembechler_Hall_031.jpg",
    "UMCampusStockPhotos21(015).jpg": "UM_Campus_StockPhotos_2021_015.jpg",
    "FDH19-UConn(148).jpg": "Field_Hockey_UConn_2019_09-13_Win3-2_148.jpg",
    "Stock_SnowdayJan23_239.jpg": "Snow_Day_January_2023_239.jpg",
    "Stock_SumrStudents29Jul21_025.jpg": "Summer_Students_July29_2021_025.jpg",
    "Stock_SumrStudents29Jul21_019.jpg": "Summer_Students_July29_2021_019.jpg",
    "KinesiologyLab-Hand22(16).jpg": "Kinesiology_Lab_Hand_2022_016.jpg",
    "SolarEclipse10June21(002).jpg": "Solar_Eclipse_June10_2021_002.jpg",
    "BurtonTwrAprLght21(193).jpg": "Burton_Tower_April_Light_2021_193.jpg",
    "UMMA-Exterior19(023).jpg": "UMMA_Exterior_2019_023.jpg",
    "UMCampusStock1-20(131).jpg": "UM_Campus_Stock1_2020_131.jpg",
    "UMMA-Exterior19(042).jpg": "UMMA_Exterior_2019_042.jpg",
    "Stock_FallMisc21_001.jpg": "Fall_Misc_2021_001.jpg",
    "UMMA-Exterior19(054).jpg": "UMMA_Exterior_2019_054.jpg",
    "CampusAerials20(213).jpg": "Campus_Aerial_2020_213.jpg",
    "UM-MiscStock18(035)1.jpg": "UM_Misc_Stock18_035_1.jpg",
    "CampusAerials20(301).jpg": "Campus_Aerial_2020_301.jpg",
    "UMCampusStock2-20(161).jpg": "UM_Campus_Stock2_2020_161.jpg",
    "UMMA-Exterior19(032).jpg": "UMMA_Exterior_2019_032.jpg",
    "Stock_SocialFallcolors21_013.jpg": "Social_Fall_Colors_2021_013.jpg",
    "CampusAerials20(234).jpg": "Campus_Aerial_2020_234.jpg",
    "Stock_SumrStudents29Jul21_079.jpg": "Summer_Students_July29_2021_079.jpg",
    "Stock_SnowdayJan23_066.jpg": "Snow_Day_January_2023_066.jpg",
    "CampusAerials20(255).jpg": "Campus_Aerial_2020_255.jpg",
    "CampusAerials20(310).jpg": "Campus_Aerial_2020_310.jpg",
    "UMCampusMiscStock22_SS_204.jpg": "UM_Campus_Misc_Stock22_SS_204.jpg",
    "BKM19-MaizedCrisler(019).jpg": "Maized_Crisler_BKM_2019_019.jpg",
    "Stock_FallMisc21_071.jpg": "Fall_Misc_2021_071.jpg",
    "LSA-BldgExtn20(54).jpg": "LSA_Building_Extension_2020_054.jpg",
    "CampusAerials_eb(006).jpg": "Campus_Aerial_EB_006.jpg",
    "1stDayWntrSmstr21(100).jpg": "1st_Day_Winter_Semester_2021_100.jpg",
    "Stock_SpringCampus_032.jpg": "Spring_Campus_2021_032.jpg",
    "CovidCampusStockApr20(26).jpg": "Covid_Campus_Stock_April20_2020_026.jpg",
    "UMCampusMiscStock17(032).jpg": "UM_Campus_Misc_Stock17_032.jpg",
    "UMStockMisc2Dec21_008.jpg": "UM_Stock_Misc2_December_2021_008.jpg",
    "SOM19-FGC(100).jpg": "Men_Soccer_FGC_2019_08-30_Loss3-4_100.jpg",
    "OnoInauguration_0457.jpg": "Ono_Inauguration_0457.jpg",
    "CampusAerials20(327).jpg": "Campus_Aerial_2020_327.jpg",
    "Stock_FallMisc21_117.jpg": "Fall_Misc_2021_117.jpg",
    "UMStockMisc2Dec21_009.jpg": "UM_Stock_Misc2_December_2021_009.jpg",
}

organizedPaths = {
    "../assets/MPhotos/Fall_Misc_2021_051.jpg": "../assets/MPhotos/Seasons/Fall/2021_051.jpg",
    "../assets/MPhotos/Summer_Students_July29_2021_019.jpg": "../assets/MPhotos/Seasons/Summer/2021_019.jpg",
    "../assets/MPhotos/Summer_Students_July29_2021_025.jpg": "../assets/MPhotos/Seasons/Summer/2021_025.jpg",
    "../assets/MPhotos/UM_Campus_Misc_Stock22_112.jpg": "../assets/MPhotos/Campus_Stock/2022_112.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_310.jpg": "../assets/MPhotos/Aerials/2020_310.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_338.jpg": "../assets/MPhotos/Aerials/2020_338.jpg",
    "../assets/MPhotos/UMS_Victors_Arts_Gala_2018_119.jpg": "../assets/MPhotos/UMS_Victors_Arts_Gala_2018_119.jpg",
    "../assets/MPhotos/Spirit_Day_BCTN_2017_071.jpg": "../assets/MPhotos/Spirit_Day_BCTN_2017_071.jpg",
    "../assets/MPhotos/Snow_Stock_February16_2021_027.jpg": "../assets/MPhotos/Campus_Stock/2021_027.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_299.jpg": "../assets/MPhotos/Aerials/2020_299.jpg",
    "../assets/MPhotos/Frankel_Detroit_Observatory_2022_08-18_085.jpg": "../assets/MPhotos/Frankel_Detroit_Observatory_2022_08-18_085.jpg",
    "../assets/MPhotos/UM_Campus_Misc_Stock22_SS_220.jpg": "../assets/MPhotos/Campus_Stock/2022_220.jpg",
    "../assets/MPhotos/Social_Fall_Colors_2021_008.jpg": "../assets/MPhotos/Seasons/Fall/2021_008.jpg",
    "../assets/MPhotos/Fall_Misc_2021_053.jpg": "../assets/MPhotos/Seasons/Fall/2021_053.jpg",
    "../assets/MPhotos/Maized_Crisler_BKM_2019_019.jpg": "../assets/MPhotos/Maized_Crisler_BKM_2019_019.jpg",
    "../assets/MPhotos/Ruthven_February_2022_01.jpg": "../assets/MPhotos/Ruthven_February_2022_01.jpg",
    "../assets/MPhotos/UM_Campus_StockPhotos_2021_015.jpg": "../assets/MPhotos/Campus_Stock/2021_015.jpg",
    "../assets/MPhotos/Snow_Day_January_2023_239.jpg": "../assets/MPhotos/Seasons/Snow/2023_239.jpg",
    "../assets/MPhotos/Fall_Misc_2021_097.jpg": "../assets/MPhotos/Seasons/Fall/2021_097.jpg",
    "../assets/MPhotos/UM_Misc_Stock18_039_1.jpg": "../assets/MPhotos/Campus_Stock/2018_039_1.jpg",
    "../assets/MPhotos/Dedication_Cemetery_BSB_Nat_Hist_Museum_087.jpg": "../assets/MPhotos/Dedication_Cemetery_BSB_Nat_Hist_Museum_087.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_301.jpg": "../assets/MPhotos/Aerials/2020_301.jpg",
    "../assets/MPhotos/Social_Fall_Colors_2021_026.jpg": "../assets/MPhotos/Seasons/Fall/2021_026.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_372.jpg": "../assets/MPhotos/Aerials/2020_372.jpg",
    "../assets/MPhotos/Snow_February_2021_030.jpg": "../assets/MPhotos/Seasons/Snow/2021_030.jpg",
    "../assets/MPhotos/UM_Campus_Misc_Stock17_066.jpg": "../assets/MPhotos/Campus_Stock/2017_066.jpg",
    "../assets/MPhotos/Snow_February_2021_019.jpg": "../assets/MPhotos/Seasons/Snow/2021_019.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_213.jpg": "../assets/MPhotos/Aerials/2020_213.jpg",
    "../assets/MPhotos/LSA_Building_with_Cube_2020_07-28_086.jpg": "../assets/MPhotos/LSA_Building_with_Cube_2020_07-28_086.jpg",
    "../assets/MPhotos/Summer_Students_July29_2021_079.jpg": "../assets/MPhotos/Seasons/Summer/2021_079.jpg",
    "../assets/MPhotos/Ono_Inauguration_0457.jpg": "../assets/MPhotos/Ono_Inauguration_0457.jpg",
    "../assets/MPhotos/UM_Misc_Stock18_060_1.jpg": "../assets/MPhotos/Campus_Stock/2018_060_1.jpg",
    "../assets/MPhotos/Kinesiology_Building_2021_002.jpg": "../assets/MPhotos/Kinesiology_Building_2021_002.jpg",
    "../assets/MPhotos/Football_Homecoming_Maryland_2022_09-24_Win34-27_361.jpg": "../assets/MPhotos/Football_Homecoming_Maryland_2022_09-24_Win34-27_361.jpg",
    "../assets/MPhotos/Snow_February_2021_022.jpg": "../assets/MPhotos/Seasons/Snow/2021_022.jpg",
    "../assets/MPhotos/GGBrown_Building_Sun_2015_026.jpg": "../assets/MPhotos/GGBrown_Building_Sun_2015_026.jpg",
    "../assets/MPhotos/Football_Senior_Day_Indiana_2018_11-17_Win31-20_236.jpg": "../assets/MPhotos/Football_Senior_Day_Indiana_2018_11-17_Win31-20_236.jpg",
    "../assets/MPhotos/UM_Stock_Misc2_December_2021_005.jpg": "../assets/MPhotos/Campus_Stock/2021_005.jpg",
    "../assets/MPhotos/North_Campus_Morning_June15_01.jpg": "../assets/MPhotos/North_Campus_Morning_June15_01.jpg",
    "../assets/MPhotos/Trotter_Exterior_2019_030.jpg": "../assets/MPhotos/Trotter_Exterior_2019_030.jpg",
    "../assets/MPhotos/UM_Campus_Snow_2022_011.jpg": "../assets/MPhotos/Campus_Stock/2022_011.jpg",
    "../assets/MPhotos/Snow_Day_January_2023_066.jpg": "../assets/MPhotos/Seasons/Snow/2023_066.jpg",
    "../assets/MPhotos/Lurie_Tower_20th_Anniversary_2016_10-20_097.jpg": "../assets/MPhotos/Lurie_Tower_20th_Anniversary_2016_10-20_097.jpg",
    "../assets/MPhotos/Snow_February_2021_020.jpg": "../assets/MPhotos/Seasons/Snow/2021_020.jpg",
    "../assets/MPhotos/Men_Soccer_FGC_2019_08-30_Loss3-4_100.jpg": "../assets/MPhotos/Men_Soccer_FGC_2019_08-30_Loss3-4_100.jpg",
    "../assets/MPhotos/Covid_Campus_Stock_April20_2020_026.jpg": "../assets/MPhotos/Campus_Stock/2020_026.jpg",
    "../assets/MPhotos/UM_Campus_Snow_2022_021.jpg": "../assets/MPhotos/Campus_Stock/2022_021.jpg",
    "../assets/MPhotos/Burton_Tower_April_Light_2021_193.jpg": "../assets/MPhotos/Burton_Tower_April_Light_2021_193.jpg",
    "../assets/MPhotos/Snow_Day_January_2023_123.jpg": "../assets/MPhotos/Seasons/Snow/2023_123.jpg",
    "../assets/MPhotos/Detroit_Mercy_BKW_003.jpg": "../assets/MPhotos/Detroit_Mercy_BKW_003.jpg",
    "../assets/MPhotos/1st_Day_Winter_Semester_2021_100.jpg": "../assets/MPhotos/1st_Day_Winter_Semester_2021_100.jpg",
    "../assets/MPhotos/UMMA_Exterior_2019_032.jpg": "../assets/MPhotos/UMMA_Exterior_2019_032.jpg",
    "../assets/MPhotos/UM_Campus_Stock2_2020_148.jpg": "../assets/MPhotos/Campus_Stock/2020_148.jpg",
    "../assets/MPhotos/UM_Campus_Stock1_2020_236.jpg": "../assets/MPhotos/Campus_Stock/2020_236.jpg",
    "../assets/MPhotos/Summer_Students_July29_2021_110.jpg": "../assets/MPhotos/Seasons/Summer/2021_110.jpg",
    "../assets/MPhotos/UM_Stock_Misc2_December_2021_008.jpg": "../assets/MPhotos/Campus_Stock/2021_008.jpg",
    "../assets/MPhotos/Summer_Students_July_2021_106.jpg": "../assets/MPhotos/Seasons/Summer/2021_106.jpg",
    "../assets/MPhotos/Field_Hockey_UConn_2019_09-13_Win3-2_148.jpg": "../assets/MPhotos/Field_Hockey_UConn_2019_09-13_Win3-2_148.jpg",
    "../assets/MPhotos/BioMed_Research_Panel19_059.jpg": "../assets/MPhotos/BioMed_Research_Panel19_059.jpg",
    "../assets/MPhotos/UM_Stock_Misc2_December_2021_009.jpg": "../assets/MPhotos/Campus_Stock/2021_009.jpg",
    "../assets/MPhotos/UM_Campus_Stock2_2020_161.jpg": "../assets/MPhotos/Campus_Stock/2020_161.jpg",
    "../assets/MPhotos/Fall_Misc_2021_001.jpg": "../assets/MPhotos/Seasons/Fall/2021_001.jpg",
    "../assets/MPhotos/UMMA_Exterior_2019_023.jpg": "../assets/MPhotos/UMMA_Exterior_2019_023.jpg",
    "../assets/MPhotos/Snow_Day_January_2023_124.jpg": "../assets/MPhotos/Seasons/Snow/2023_124.jpg",
    "../assets/MPhotos/Denis_Matsuev_UMS19_046.jpg": "../assets/MPhotos/Denis_Matsuev_UMS19_046.jpg",
    "../assets/MPhotos/Schembechler_Hall_031.jpg": "../assets/MPhotos/Schembechler_Hall_031.jpg",
    "../assets/MPhotos/UM_Campus_Stock1_2020_164_A.jpg": "../assets/MPhotos/Campus_Stock/2020_164_A.jpg",
    "../assets/MPhotos/Campus_Aerial_EB_248.jpg": "../assets/MPhotos/Aerials/EB_248.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_234.jpg": "../assets/MPhotos/Aerials/2020_234.jpg",
    "../assets/MPhotos/Snow_Day_January_2023_079.jpg": "../assets/MPhotos/Seasons/Snow/2023_079.jpg",
    "../assets/MPhotos/Summer_Students_July29_2021_076.jpg": "../assets/MPhotos/Seasons/Summer/2021_076.jpg",
    "../assets/MPhotos/Kinesiology_Lab_Hand_2022_016.jpg": "../assets/MPhotos/Kinesiology_Lab_Hand_2022_016.jpg",
    "../assets/MPhotos/Spring_Campus_2021_032.jpg": "../assets/MPhotos/Seasons/Spring/2021_032.jpg",
    "../assets/MPhotos/UM_Campus_Stock2_2020_006.jpg": "../assets/MPhotos/Campus_Stock/2020_006.jpg",
    "../assets/MPhotos/LSA_Welcome_Back_Picnic_2021_106.jpg": "../assets/MPhotos/LSA_Welcome_Back_Picnic_2021_106.jpg",
    "../assets/MPhotos/Campus_Aerial_EB_006.jpg": "../assets/MPhotos/Aerials/EB_006.jpg",
    "../assets/MPhotos/UM_Misc_Stock18_035_1.jpg": "../assets/MPhotos/Campus_Stock/2018_035_1.jpg",
    "../assets/MPhotos/Solar_Eclipse_June10_2021_002.jpg": "../assets/MPhotos/Solar_Eclipse_June10_2021_002.jpg",
    "../assets/MPhotos/Fall_Misc_2021_071.jpg": "../assets/MPhotos/Seasons/Fall/2021_071.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_327.jpg": "../assets/MPhotos/Aerials/2020_327.jpg",
    "../assets/MPhotos/LSA_Building_Extension_2020_054.jpg": "../assets/MPhotos/LSA_Building_Extension_2020_054.jpg",
    "../assets/MPhotos/UM_Campus_Misc_Stock17_032.jpg": "../assets/MPhotos/Campus_Stock/2017_032.jpg",
    "../assets/MPhotos/Summer_Students_July29_2021_002.jpg": "../assets/MPhotos/Seasons/Summer/2021_002.jpg",
    "../assets/MPhotos/UMMA_Exterior_2019_054.jpg": "../assets/MPhotos/UMMA_Exterior_2019_054.jpg",
    "../assets/MPhotos/UM_Campus_Misc_Stock22_SS_204.jpg": "../assets/MPhotos/Campus_Stock/2022_204.jpg",
    "../assets/MPhotos/Fall_Misc_2021_117.jpg": "../assets/MPhotos/Seasons/Fall/2021_117.jpg",
    "../assets/MPhotos/Ross_School_of_Business_2022_11-03_268.jpg": "../assets/MPhotos/Ross_School_of_Business_2022_11-03_268.jpg",
    "../assets/MPhotos/UM_Campus_Stock1_2020_131.jpg": "../assets/MPhotos/Campus_Stock/2020_131.jpg",
    "../assets/MPhotos/Campus_Aerial_2020_255.jpg": "../assets/MPhotos/Aerials/2020_255.jpg",
    "../assets/MPhotos/Social_Fall_Colors_2021_013.jpg": "../assets/MPhotos/Seasons/Fall/2021_013.jpg",
    "../assets/MPhotos/UMMA_Exterior_2019_042.jpg": "../assets/MPhotos/UMMA_Exterior_2019_042.jpg",
}


def Reverse():

    newDict = dict()

    for key, value in organizedPaths.items():

        newDict[value] = key

    with open("newDict.json", "w", encoding="utf-8") as jsonFile:
        json.dump(newDict, jsonFile, ensure_ascii=False, indent=4)


def MakeSubdirs():

    for src, dest in organizedPaths.items():

        destPath = Path(dest)

        destPath.parent.mkdir(parents=True, exist_ok=True)
        Path(src).rename(destPath)


def ReplaceImagePaths():

    indexPath = Path("../index.html")

    if indexPath.is_file():

        with open(indexPath, "r", encoding="utf-8") as file:

            content = file.read()

        for key, value in organizedPaths.items():

            if key.startswith("../"):

                key = key.replace("../", "")

            if key.startswith("../"):

                key = key.replace("../", "")

            content = re.sub(re.escape(key), value, content)

        indexPath = Path("../test.html")

        with open(indexPath, "w", encoding="utf-8") as file:
            file.write(content)


ReplaceImagePaths()
# MakeSubdirs()
