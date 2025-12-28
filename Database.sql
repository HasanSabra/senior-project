-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 24, 2025 at 03:38 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `senior`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_users`
--

DROP TABLE IF EXISTS `auth_users`;
CREATE TABLE IF NOT EXISTS `auth_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `experience` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `qual_edu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `personal_statement` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `manifesto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `election_id` int DEFAULT NULL,
  `list_id` int DEFAULT NULL,
  `is_request` tinyint(1) NOT NULL DEFAULT '0',
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `election_id` (`election_id`),
  KEY `list_id` (`list_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `constituencies`
--

DROP TABLE IF EXISTS `constituencies`;
CREATE TABLE IF NOT EXISTS `constituencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `governorate_id` int DEFAULT NULL,
  `total_seats` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `governorate_id` (`governorate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `constituencies`
--

INSERT INTO `constituencies` (`id`, `name`, `governorate_id`, `total_seats`) VALUES
(1, 'Beirut I (Capital, Diverse)', 1, 8),
(2, 'Beirut II (Capital, Diverse)', 1, 10),
(3, 'Bekaa I (Baalbek-Hermel)', 4, 10),
(4, 'Bekaa II (Zahle)', 4, 7),
(5, 'Bekaa III (West Bekaa-Rachaya)', 4, 6),
(6, 'Mount Lebanon I (Jbeil-Keserwan)', 2, 8),
(7, 'Mount Lebanon II (North Metn)', 2, 8),
(8, 'Mount Lebanon III (Baabda)', 2, 6),
(9, 'Mount Lebanon IV (Aley)', 2, 6),
(10, 'Mount Lebanon V (Chouf)', 2, 8),
(11, 'North I (Akkar)', 3, 7),
(12, 'North II (Dinniyeh-Minieh)', 3, 4),
(13, 'North III (Tripoli)', 3, 8),
(14, 'South I (Saida-Jezzine)', 6, 7),
(15, 'South II (Tyre-Zahrani)', 6, 7);

-- --------------------------------------------------------

--
-- Table structure for table `constituency_denomination_allocation`
--

DROP TABLE IF EXISTS `constituency_denomination_allocation`;
CREATE TABLE IF NOT EXISTS `constituency_denomination_allocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `constituency_id` int NOT NULL,
  `denomination_id` int NOT NULL,
  `seats_allocated` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `constituency_id` (`constituency_id`,`denomination_id`),
  KEY `denomination_id` (`denomination_id`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `constituency_denomination_allocation`
--

INSERT INTO `constituency_denomination_allocation` (`id`, `constituency_id`, `denomination_id`, `seats_allocated`) VALUES
(46, 4, 1, 1),
(45, 4, 5, 2),
(44, 4, 4, 2),
(43, 4, 3, 2),
(42, 13, 4, 1),
(41, 13, 3, 2),
(40, 13, 1, 5),
(39, 10, 8, 3),
(38, 10, 3, 3),
(37, 10, 1, 2),
(36, 6, 5, 1),
(35, 6, 4, 2),
(34, 6, 3, 5),
(33, 2, 5, 1),
(32, 2, 4, 1),
(31, 2, 3, 2),
(30, 2, 2, 2),
(29, 2, 1, 4),
(28, 1, 5, 1),
(27, 1, 4, 2),
(26, 1, 3, 2),
(25, 1, 2, 1),
(24, 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `denominations`
--

DROP TABLE IF EXISTS `denominations`;
CREATE TABLE IF NOT EXISTS `denominations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `religion_id` int DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `religion_id` (`religion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `denominations`
--

INSERT INTO `denominations` (`id`, `religion_id`, `name`) VALUES
(1, 1, 'sunni'),
(2, 1, 'shia'),
(3, 2, 'maronite'),
(4, 2, 'greek orthodox'),
(5, 2, 'greek catholic'),
(6, 2, 'armenian orthodox'),
(7, 2, 'armenian catholic'),
(8, 1, 'druze'),
(9, 1, 'alawite'),
(10, 2, 'minorities');

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
CREATE TABLE IF NOT EXISTS `districts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `governorate_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `governorate_id` (`governorate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `governorate_id`) VALUES
(1, 'Beirut', 1),
(2, 'Baabda', 2),
(3, 'Aley', 2),
(4, 'Matn', 2),
(5, 'Chouf', 2),
(6, 'Byblos', 2),
(7, 'Keserwen', 2),
(8, 'Tripoli', 3),
(9, 'Zgharta', 3),
(10, 'Bsharri', 3),
(11, 'Batroun', 3),
(12, 'Koura', 3),
(13, 'Minyeh-Danniyeh', 3),
(14, 'Akkar', 3),
(15, 'Zahle', 4),
(16, 'Baalbek', 4),
(17, 'Hermel', 4),
(18, 'Western Beqaa', 4),
(19, 'Nabatieh', 5),
(20, 'Hasbaya', 5),
(21, 'Marjeyoun', 5),
(22, 'Bint Jbeil', 5),
(23, 'Sidon', 6),
(24, 'Tyre', 6),
(25, 'Jezzine', 6),
(27, 'Rashaya', 4);

-- --------------------------------------------------------

--
-- Table structure for table `elections`
--

DROP TABLE IF EXISTS `elections`;
CREATE TABLE IF NOT EXISTS `elections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `rounds` int NOT NULL DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `election_type_id` int DEFAULT NULL,
  `governorate_id` int DEFAULT NULL,
  `district_id` int DEFAULT NULL,
  `village_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `election_type_id` (`election_type_id`),
  KEY `governorate_id` (`governorate_id`),
  KEY `district_id` (`district_id`),
  KEY `village_id` (`village_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `election_types`
--

DROP TABLE IF EXISTS `election_types`;
CREATE TABLE IF NOT EXISTS `election_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `election_types`
--

INSERT INTO `election_types` (`id`, `type`) VALUES
(1, 'Mayoral'),
(2, 'Municipal'),
(3, 'Parliamentary'),
(4, 'Speaker');

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

DROP TABLE IF EXISTS `genders`;
CREATE TABLE IF NOT EXISTS `genders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`id`, `type`) VALUES
(2, 'female'),
(1, 'male');

-- --------------------------------------------------------

--
-- Table structure for table `governorates`
--

DROP TABLE IF EXISTS `governorates`;
CREATE TABLE IF NOT EXISTS `governorates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `governorates`
--

INSERT INTO `governorates` (`id`, `name`) VALUES
(1, 'Beirut'),
(4, 'Beqaa'),
(2, 'Mount Lebanon'),
(5, 'Nabatieh'),
(3, 'North'),
(6, 'South');

-- --------------------------------------------------------

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
CREATE TABLE IF NOT EXISTS `lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `seats_number` int NOT NULL,
  `election_id` int DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `constituency_id` int DEFAULT NULL,
  `district_id` int DEFAULT NULL,
  `village_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `constituency_id` (`constituency_id`),
  KEY `district_id` (`district_id`),
  KEY `village_id` (`village_id`),
  KEY `election_id` (`election_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marital_statuses`
--

DROP TABLE IF EXISTS `marital_statuses`;
CREATE TABLE IF NOT EXISTS `marital_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marital_statuses`
--

INSERT INTO `marital_statuses` (`id`, `status`) VALUES
(3, 'divorced'),
(2, 'married'),
(1, 'single'),
(4, 'windowed');

-- --------------------------------------------------------

--
-- Table structure for table `parliaments`
--

DROP TABLE IF EXISTS `parliaments`;
CREATE TABLE IF NOT EXISTS `parliaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parliament_members`
--

DROP TABLE IF EXISTS `parliament_members`;
CREATE TABLE IF NOT EXISTS `parliament_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parliament_id` int DEFAULT NULL,
  `candidate_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parliament_id` (`parliament_id`),
  KEY `candidate_id` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `religions`
--

DROP TABLE IF EXISTS `religions`;
CREATE TABLE IF NOT EXISTS `religions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `religions`
--

INSERT INTO `religions` (`id`, `name`) VALUES
(2, 'christianiy'),
(1, 'islam');

-- --------------------------------------------------------

--
-- Table structure for table `speaker_of_parliament`
--

DROP TABLE IF EXISTS `speaker_of_parliament`;
CREATE TABLE IF NOT EXISTS `speaker_of_parliament` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parliament_id` int DEFAULT NULL,
  `candidate_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parliament_id` (`parliament_id`),
  KEY `candidate_id` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pin` int NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` date NOT NULL,
  `family_record_number` int NOT NULL,
  `is_alive` tinyint(1) NOT NULL DEFAULT '0',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `governorate_id` int DEFAULT NULL,
  `district_id` int DEFAULT NULL,
  `village_id` int DEFAULT NULL,
  `gender_id` int DEFAULT NULL,
  `marital_status_id` int DEFAULT NULL,
  `religion_id` int DEFAULT NULL,
  `denomination_id` int DEFAULT NULL,
  `father_id` int DEFAULT NULL,
  `mother_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pin` (`pin`),
  KEY `governorate_id` (`governorate_id`),
  KEY `district_id` (`district_id`),
  KEY `village_id` (`village_id`),
  KEY `gender_id` (`gender_id`),
  KEY `marital_status_id` (`marital_status_id`),
  KEY `religion_id` (`religion_id`),
  KEY `denomination_id` (`denomination_id`),
  KEY `users_ibfk_8` (`father_id`),
  KEY `users_ibfk_9` (`mother_id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `villages`
--

DROP TABLE IF EXISTS `villages`;
CREATE TABLE IF NOT EXISTS `villages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `district_id` (`district_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `villages`
--

INSERT INTO `villages` (`id`, `name`, `district_id`) VALUES
(1, 'Beirut', 1),
(157, 'Arsoon', 6),
(158, 'Al Hazmieh', 6),
(159, 'Al Hadesh', 6),
(160, 'Sbenneh', 6),
(161, 'Harat Al Batm', 6),
(162, 'Al Kharayeb', 6),
(163, 'Al Shabanieh', 6),
(164, 'Al Shiyah', 6),
(165, 'Al Abbadieh', 6),
(166, 'Al Arabanieh', 6),
(167, 'Al Dalyeh', 6),
(168, 'Al Ghobeiri', 6),
(169, 'Al Qarya', 6),
(170, 'Al Qasaybeh', 6),
(171, 'Al Qalaa', 6),
(172, 'Al Kaniseh', 6),
(173, 'Al Hilalieh', 6),
(174, 'Btekhnay', 6),
(175, 'Bourj Al Barajneh', 6),
(176, 'Bzebdin', 6),
(177, 'Bsaba', 6),
(178, 'Batshiyeh', 6),
(179, 'Batshiyeh', 6),
(180, 'Al Loueizeh', 6),
(181, 'Baalshemieh', 6),
(182, 'Bmariam', 6),
(183, 'Tahweitat Al Ghadeer', 6),
(184, 'Al Laylakeh', 6),
(185, 'Al Marajeh', 6),
(186, 'Tarshish', 6),
(187, 'Jouar Al Hoz', 6),
(188, 'Jouret Arsoon', 6),
(189, 'Harat Al Sit', 6),
(190, 'Harat Horeik', 6),
(191, 'Hasbaya Al Matn', 6),
(192, 'Hammana', 6),
(193, 'Deir Al Harf', 6),
(194, 'Ras Al Harf', 6),
(195, 'Ras Al Matn', 6),
(196, 'Rweiset Al Balout', 6),
(197, 'Shweit', 6),
(198, 'Salima', 6),
(199, 'Araya', 6),
(200, 'Falougha', 6),
(201, 'Al Khalawat', 6),
(202, 'Furn Al Shubbak', 6),
(203, 'Ain Al Rummaneh', 6),
(204, 'Tahweitat Al Nahr', 6),
(205, 'Qbeiy', 6),
(206, 'Qartaba', 6),
(207, 'Qornayel', 6),
(208, 'Kfarselwan', 6),
(209, 'Kfarshima', 6),
(210, 'Wadi Shahrour Al Sufla', 6),
(211, 'Wadi Shahrour Al Ulya', 6),
(318, 'Adma', 7),
(319, 'Al Dafneh', 7),
(320, 'Al Bwar', 7),
(321, 'Al Jadida (Jadidet Ghazir)', 7),
(322, 'Harharya wa Al Qatin', 7),
(323, 'Al Husein', 7),
(324, 'Al Safra', 7),
(325, 'Al Adhra', 7),
(326, 'Al Adhr', 7),
(327, 'Al Aqaybeh', 7),
(328, 'Al Ghayneh', 7),
(329, 'Al Qlayaat', 7),
(330, 'Al Kfour', 7),
(331, 'Al Mayassara', 7),
(332, 'Al Numoura', 7),
(333, 'Kfar Jreif', 7),
(334, 'Bzammar', 7),
(335, 'Batkha', 7),
(336, 'Bqaata Ashqout', 7),
(337, 'Bqaata Kanaan', 7),
(338, 'Bqaetouteh', 7),
(339, 'Blouneh', 7),
(340, 'Jaaita', 7),
(341, 'Jouret Al Tarmas', 7),
(342, 'Jouret Badran', 7),
(343, 'Jounieh', 7),
(344, 'Hrajel', 7),
(345, 'Hayata', 7),
(346, 'Darya', 7),
(347, 'Daroun', 7),
(348, 'Harissa', 7),
(349, 'Dalbta', 7),
(350, 'Rashin', 7),
(351, 'Rayfoun', 7),
(352, 'Zaaaytreh', 7),
(353, 'Zouk Mosbeh', 7),
(354, 'Zouk Mkayel', 7),
(355, 'Zaytoun', 7),
(356, 'Suhayleh', 7),
(357, 'Shhatoul', 7),
(358, 'Jouret Mahad', 7),
(359, 'Shananeer', 7),
(360, 'Tabarja', 7),
(361, 'Kfaryassine', 7),
(362, 'Ajalton', 7),
(363, 'Aramoun', 7),
(364, 'Ashqout', 7),
(365, 'Ain Al Rayhaneh', 7),
(366, 'Aintoura', 7),
(367, 'Ghabaleh', 7),
(368, 'Ghadras', 7),
(369, 'Ghazir', 7),
(370, 'Ghosta', 7),
(371, 'Farya', 7),
(372, 'Fataqa', 7),
(373, 'Feitroun', 7),
(374, 'Kfarteyh', 7),
(375, 'Kfardebian', 7),
(376, 'Mayrouba', 7),
(377, 'Wata Al Joz', 7),
(378, 'Yahshoush', 7),
(379, 'Al Barouk', 5),
(380, 'Al Faradis', 5),
(381, 'Al Burjain', 5),
(382, 'Al Marjiyat', 5),
(383, 'Al Bira', 5),
(384, 'Al Jahiliya', 5),
(385, 'Al Jiyeh', 5),
(386, 'Al Kharayeb', 5),
(387, 'Al Damour', 5),
(388, 'Al Dibbiyeh', 5),
(389, 'Al Rumayleh', 5),
(390, 'Al Zaarouriya', 5),
(391, 'Al Samqaniya', 5),
(392, 'Al Fawwara', 5),
(393, 'Al Kahalouniya', 5),
(394, 'Al Kanisa', 5),
(395, 'Al Mukhtara', 5),
(396, 'Al Mushrif', 5),
(397, 'Al Matleh', 5),
(398, 'Al Mughayriyeh', 5),
(399, 'Al Naameh', 5),
(400, 'Harat Al Naameh', 5),
(401, 'Al Wardaniyeh', 5),
(402, 'Al Warhaniyeh', 5),
(403, 'Bater', 5),
(404, 'Batlloun', 5),
(405, 'Barja', 5),
(406, 'Brayj', 5),
(407, 'Bsaba', 5),
(408, 'Bashtfeen', 5),
(409, 'Batma', 5),
(410, 'Baaasir', 5),
(411, 'Harat Baaasir', 5),
(412, 'Baaadran', 5),
(413, 'Baakleen', 5),
(414, 'Beit El Din', 5),
(415, 'Jbaa', 5),
(416, 'Jadra', 5),
(417, 'Wadi Al Zayna', 5),
(418, 'Jadidet Al Shouf', 5),
(419, 'Joun', 5),
(420, 'Harat Jandal', 5),
(421, 'Hasroun', 5),
(422, 'Darya', 5),
(423, 'Dalhoun', 5),
(424, 'Dmeit', 5),
(425, 'Deir Al Qamar', 5),
(426, 'Deir Dourite', 5),
(427, 'Deir Koucheh', 5),
(428, 'Sableen', 5),
(429, 'Sarjbal', 5),
(430, 'Sheheem', 5),
(431, 'Dahr Al Maghara', 5),
(432, 'Anout', 5),
(433, 'Atreen', 5),
(434, 'Alaman', 5),
(435, 'Al Barghouniya', 5),
(436, 'Amatour', 5),
(437, 'Ameeq', 5),
(438, 'Ain Al Hoor', 5),
(439, 'Ain Zahelta', 5),
(440, 'Ain Qeni', 5),
(441, 'Ain wa Zein', 5),
(442, 'Ainbal', 5),
(443, 'Ghraifeh', 5),
(444, 'Ketermaya', 5),
(445, 'Kfarheim', 5),
(446, 'Kfarfaqoud', 5),
(447, 'Kfarqatra', 5),
(448, 'Kfarnabrakh', 5),
(449, 'Kfarnis', 5),
(450, 'Majdal Al Maoush', 5),
(451, 'Maristi', 5),
(452, 'Mazboud', 5),
(453, 'Mazraat Al Shouf', 5),
(454, 'Mazraat Al Dahr', 5),
(455, 'Maasir Al Shouf', 5),
(456, 'Maasir Beit El Din', 5),
(457, 'Niha', 5),
(458, 'Wadi Al Sit', 5),
(459, 'Aghmeed', 3),
(460, 'Al Basateen', 3),
(461, 'Al Bniyeh', 3),
(462, 'Al Tazaniyeh', 3),
(463, 'Al Rajmeh', 3),
(464, 'Al Ramliyeh', 3),
(465, 'Al Shwayfat', 3),
(466, 'Al Ghaboun', 3),
(467, 'Al Qmatieh', 3),
(468, 'Al Kahaleh', 3),
(469, 'Al Musharrafah', 3),
(470, 'Al Mansouriyeh', 3),
(471, 'Ain Al Marj', 3),
(472, 'Btater', 3),
(473, 'Bahmadoun', 3),
(474, 'Bkhishtieh', 3),
(475, 'Bdadoun', 3),
(476, 'Badghan', 3),
(477, 'Bsous', 3),
(478, 'Bshamoun', 3),
(479, 'Batlloun', 3),
(480, 'Baourta', 3),
(481, 'Blaybl', 3),
(482, 'Bmkeyn', 3),
(483, 'Bmahriyeh', 3),
(484, 'Baysour', 3),
(485, 'Howmal', 3),
(486, 'Dafoun', 3),
(487, 'Dqoun', 3),
(488, 'Deir Qoubel', 3),
(489, 'Rashmaya', 3),
(490, 'Rimhala', 3),
(491, 'Rweisat Al Naaman', 3),
(492, 'Sarhmoul', 3),
(493, 'Salfaya', 3),
(494, 'Souq Al Gharb', 3),
(495, 'Sharon', 3),
(496, 'Shaniyeh', 3),
(497, 'Chartoun', 3),
(498, 'Shamlan', 3),
(499, 'Sofar', 3),
(500, 'Aley', 3),
(501, 'Abeyeh', 3),
(502, 'Ain Darfil', 3),
(503, 'Aramoun', 3),
(504, 'Aytat', 3),
(505, 'Ain Al Jadideh', 3),
(506, 'Ain Al Rummeneh', 3),
(507, 'Ain Al Sayedeh', 3),
(508, 'Ain Dara', 3),
(509, 'Ain Anoub', 3),
(510, 'Ain Ksour', 3),
(511, 'Ainab', 3),
(512, 'Kfarmeyeh', 3),
(513, 'Kfarmatta', 3),
(514, 'Keyfoun', 3),
(515, 'Majdalaya', 3),
(516, 'Majdalbaana', 3),
(517, 'Mahattat Bahmadoun', 3),
(654, 'Al Jadideh', 4),
(655, 'Al Bouchriyeh', 4),
(656, 'Sadd Al Bouchriyeh', 4),
(657, 'Al Khinshara', 4),
(658, 'Al Jawaar', 4),
(659, 'Al Dekwaneh', 4),
(660, 'Mar Roukoz', 4),
(661, 'Dahr Al Haseen', 4),
(662, 'Al Dwar', 4),
(663, 'Al Rabiyeh', 4),
(664, 'Al Zalqa', 4),
(665, 'Emmarat Chahloub', 4),
(666, 'Al Shweir', 4),
(667, 'Ain Al Sandiyaneh', 4),
(668, 'Al Dbayeh', 4),
(669, 'Zouk Al Kharab', 4),
(670, 'Mar Yousef', 4),
(671, 'Aukar', 4),
(672, 'Al Atchaneh', 4),
(673, 'Al Ayrun', 4),
(674, 'Al Oyoun', 4),
(675, 'Al Ghabe', 4),
(676, 'Al Fanar', 4),
(677, 'Al Qaqour', 4),
(678, 'Al Metn', 4),
(679, 'Mechka', 4),
(680, 'Al Mahidsa', 4),
(681, 'Bikfaya', 4),
(682, 'Al Mrouj', 4),
(683, 'Al Mayleb', 4),
(684, 'Al Mansouriyeh', 4),
(685, 'Al Makalles', 4),
(686, 'Al Dechouniyeh', 4),
(687, 'Antelias', 4),
(688, 'Al Naqash', 4),
(689, 'Btaghreen', 4),
(690, 'Bourj Hammoud', 4),
(691, 'Brummana', 4),
(692, 'Baskinta', 4),
(693, 'Bsalim', 4),
(694, 'Mazhar', 4),
(695, 'Al Majdoub', 4),
(696, 'Baabdat', 4),
(697, 'Biyaqout', 4),
(698, 'Beit Al Shaar', 4),
(699, 'Mazraat Al Hadira', 4),
(700, 'Beit Chabab', 4),
(701, 'Al Chawiya', 4),
(702, 'Al Qunaytira', 4),
(703, 'Beit Merry', 4),
(704, 'Jal El Dib', 4),
(705, 'Bqennaya', 4),
(706, 'Hamlaye', 4),
(707, 'Dik El Mehdi', 4),
(708, 'Deir Tamich', 4),
(709, 'Roumieh', 4),
(710, 'Zaroun', 4),
(711, 'Zakrit', 4),
(712, 'Saqiyat Al Misk', 4),
(713, 'Bahr Safa', 4),
(714, 'Sin El Fil', 4),
(715, 'Dahr Al Sawan', 4),
(716, 'Ain Al Safsaf', 4),
(717, 'Mar Mikhael Bnabeel', 4),
(718, 'Ain Saadeh', 4),
(719, 'Aintoura', 4),
(720, 'Qarnet Al Hamra', 4),
(721, 'Qornet Chehwan', 4),
(722, 'Ain Aar', 4),
(723, 'Beit El Kako', 4),
(724, 'Qannabet Brummana', 4),
(725, 'Kfarteyh', 4),
(726, 'Kfar Aqab', 4),
(727, 'Mar Chaya', 4),
(728, 'Al Mazkeh', 4),
(729, 'Mar Mousa Al Dwar', 4),
(730, 'Majdal Tarshish', 4),
(731, 'Marjaba', 4),
(732, 'Mazraat Yashouh', 4),
(733, 'Nabiyeh', 4),
(734, 'Wata Al Mrouj', 4),
(735, 'Ghabet Boulonia', 4),
(736, 'Tripoli City', 8),
(737, 'Al Mina City', 8),
(738, 'Al Qalamoun', 8),
(739, 'Ajdabra', 11),
(740, 'Addeh', 11),
(741, 'Asiya', 11),
(742, 'Al Batroun', 11),
(743, 'Al Hari', 11),
(744, 'Bshaala', 11),
(745, 'Baqsima', 11),
(746, 'Beit Shalala', 11),
(747, 'Tahoum', 11),
(748, 'Tannourine Al Faouqa', 11),
(749, 'Tannourine Al Tahta', 11),
(750, 'Wata Houb', 11),
(751, 'Jran', 11),
(752, 'Hamat', 11),
(753, 'Hardine', 11),
(754, 'Douma', 11),
(755, 'Deir Bala', 11),
(756, 'Ras Nhash', 11),
(757, 'Zane', 11),
(758, 'Slaata', 11),
(759, 'Shatine', 11),
(760, 'Shabtine', 11),
(761, 'Shikka', 11),
(762, 'Abreen', 11),
(763, 'Kfarhilda', 11),
(764, 'Kfarhi', 11),
(765, 'Kfarabida', 11),
(766, 'Kfour Al Arabi', 11),
(767, 'Kouba', 11),
(768, 'Kour', 11),
(769, 'Mahmarsh', 11),
(770, 'Bane', 10),
(771, 'Barhlayoun', 10),
(772, 'Bzaoun', 10),
(773, 'Bsharri', 10),
(774, 'Bqaakafra', 10),
(775, 'Bqarqasha', 10),
(776, 'Hadat Al Jabal', 10),
(777, 'Hadchit', 10),
(778, 'Hasroun', 10),
(779, 'Tourza', 10),
(780, 'Abdine', 10),
(781, 'Qnat', 10),
(816, 'Ardeh', 9),
(817, 'Harf Ardeh', 9),
(818, 'Beit Aakar', 9),
(819, 'Beit Obeid', 9),
(820, 'Al Bahira', 9),
(821, 'Ayto', 9),
(822, 'Ayyal', 9),
(823, 'Baslouqayt', 9),
(824, 'Banshae', 9),
(825, 'Toula Al Jabal', 9),
(826, 'Aslout', 9),
(827, 'Harat Al Fawar', 9),
(828, 'Darya', 9),
(829, 'Bshnine', 9),
(830, 'Raskifa', 9),
(831, 'Rashain', 9),
(832, 'Zgharta', 9),
(833, 'Sbaal', 9),
(834, 'Saraal', 9),
(835, 'Arabt Qazhiya', 9),
(836, 'Arajis', 9),
(837, 'Ashash', 9),
(838, 'Alma', 9),
(839, 'Aintourine', 9),
(840, 'Qara Bash', 9),
(841, 'Karm Saddeh', 9),
(842, 'Kfar Hata', 9),
(843, 'Kfar Dallaqous', 9),
(844, 'Kfar Zayna', 9),
(845, 'Kfar Sghab', 9),
(846, 'Kfarfo', 9),
(847, 'Kfar Yachit', 9),
(848, 'Majdalya', 9),
(849, 'Mrayta', 9),
(850, 'Al Qadiriya', 9),
(851, 'Mazraat Al Tuffah', 9),
(852, 'Miziara', 9),
(853, 'Harf Miziara', 9),
(854, 'Hmees', 9),
(855, 'Ajd Abreen', 12),
(856, 'Al Majdal', 12),
(857, 'Al Nakhleh', 12),
(858, 'Harat Al Khassa', 12),
(859, 'Amioun', 12),
(860, 'Anfeh', 12),
(861, 'Batroumine', 12),
(862, 'Btaaboura', 12),
(863, 'Btourayej', 12),
(864, 'Bedba', 12),
(865, 'Bednayel', 12),
(866, 'Barsa', 12),
(867, 'Bzizza', 12),
(868, 'Bshamzin', 12),
(869, 'Bsarma', 12),
(870, 'Batram', 12),
(871, 'Bkiftin', 12),
(872, 'Dar Baashtar', 12),
(873, 'Dar Shamzin', 12),
(874, 'Deddeh', 12),
(875, 'Ras Masqa', 12),
(876, 'Rashdbine', 12),
(877, 'Zakroun', 12),
(878, 'Aaba', 12),
(879, 'Ansadik', 12),
(880, 'Ain Akrine', 12),
(881, 'Fyeh', 12),
(882, 'Qalhat', 12),
(883, 'Kaftoun', 12),
(884, 'Kfar Hata', 12),
(885, 'Kfar Hazir', 12),
(886, 'Kfar Saroun', 12),
(887, 'Kfar Aaqa', 12),
(888, 'Kfar Qahel', 12),
(889, 'Kfarya', 12),
(890, 'Kousba', 12),
(891, 'Matrit', 12),
(892, 'Al Beddawi', 13),
(893, 'Al Hazmiyeh', 13),
(894, 'Al Safira', 13),
(895, 'Al Qatteen', 13),
(896, 'Al Minyeh', 13),
(897, 'Al Nabi Youshaa', 13),
(898, 'Ayzal', 13),
(899, 'Bahneen', 13),
(900, 'Mazraat Artousa', 13),
(901, 'Al Rayhaniyeh', 13),
(902, 'Bahwayta', 13),
(903, 'Afqa', 13),
(904, 'Bshnata', 13),
(905, 'Bakhoun', 13),
(906, 'Burj Al Yahoudiya', 13),
(907, 'Batarmaz', 13),
(908, 'Bqaa Sfarine', 13),
(909, 'Bqarsouna', 13),
(910, 'Beit Al Fekes', 13),
(911, 'Harf Sayyad', 13),
(912, 'Haql Al Azimeh', 13),
(913, 'Deir Amar', 13),
(914, 'Deir Nbouh', 13),
(915, 'Seer', 13),
(916, 'Taran', 13),
(917, 'Aassoun', 13),
(918, 'Azqi', 13),
(919, 'Aymar', 13),
(920, 'Ain Al Tineh', 13),
(921, 'Qarsayta', 13),
(922, 'Karm Al Mihr', 13),
(923, 'Kfarbnine', 13),
(924, 'Kfarhabou', 13),
(925, 'Kfarshlan', 13),
(926, 'Marah Al Siraj', 13),
(927, 'Marah Al Safira', 13),
(928, 'Markabta', 13),
(929, 'Nmrine', 13),
(930, 'Wadi Al Nahleh', 13),
(931, 'Akroum', 14),
(932, 'Al Burj', 14),
(933, 'Al Bira', 14),
(934, 'Al Talil', 14),
(935, 'Al Jadideh', 14),
(936, 'Al Hamira', 14),
(937, 'Al Hawaysh', 14),
(938, 'Al Hayesa', 14),
(939, 'Al Dababiya', 14),
(940, 'Al Daghlah', 14),
(941, 'Al Dura', 14),
(942, 'Al Dousa', 14),
(943, 'Baghdadi', 14),
(944, 'Al Rayhaniya', 14),
(945, 'Al Zawarib', 14),
(946, 'Al Sahla', 14),
(947, 'Al Suwaysa', 14),
(948, 'Al Shaqdouf', 14),
(949, 'Al Sheikh Taba', 14),
(950, 'Al Sheikh Ayash', 14),
(951, 'Al Sheikh Mohammed', 14),
(952, 'Al Aboudiya', 14),
(953, 'Al Amayer', 14),
(954, 'Rajem Issa', 14),
(955, 'Al Awada', 14),
(956, 'Al Awaynat', 14),
(957, 'Al Oyoun', 14),
(958, 'Al Ghazayla', 14),
(959, 'Al Fard', 14),
(960, 'Al Qbayat', 14),
(961, 'Al Qarqaf', 14),
(962, 'Al Qurna', 14),
(963, 'Al Quriyat', 14),
(964, 'Al Qlayaat', 14),
(965, 'Al Qantara', 14),
(966, 'Al Kawashra', 14),
(967, 'Al Kwaykhat', 14),
(968, 'Al Majdal', 14),
(969, 'Al Muhammara', 14),
(970, 'Al Masoudiya', 14),
(971, 'Al Maqaybila', 14),
(972, 'Al Maqyataa', 14),
(973, 'Qaabrine', 14),
(974, 'Kfarmalki', 14),
(975, 'Al Ramoul', 14),
(976, 'Al Mounsa', 14),
(977, 'Al Nafisa', 14),
(978, 'Al Nahriya', 14),
(979, 'Bustan Al Harsh', 14),
(980, 'Al Noura', 14),
(981, 'Al Haycha', 14),
(982, 'Aylat', 14),
(983, 'Bbennine', 14),
(984, 'Al Abda', 14),
(985, 'Barbara', 14),
(986, 'Burj Al Arab', 14),
(987, 'Barqayel', 14),
(988, 'Bzal', 14),
(989, 'Bzebina', 14),
(990, 'Bqarzala', 14),
(991, 'Bani Sakhr', 14),
(992, 'Beit Al Haj', 14),
(993, 'Beit Ayoub', 14),
(994, 'Beit Millat', 14),
(995, 'Beit Younes', 14),
(996, 'Baino', 14),
(997, 'Qaboula', 14),
(998, 'Tashae', 14),
(999, 'Takrit', 14),
(1000, 'Talbira', 14),
(1001, 'Talha wa Shataha', 14),
(1002, 'Tall Abbas Sharqi', 14),
(1003, 'Tall Abbas Gharbi', 14),
(1004, 'Tall Mayan', 14),
(1005, 'Gabriel', 14),
(1006, 'Jadidet Al Qaytaa', 14),
(1007, 'Jarmanaya', 14),
(1008, 'Al Rama', 14),
(1009, 'Harrar', 14),
(1010, 'Halba', 14),
(1011, 'Hayzuq', 14),
(1012, 'Khirbet Daoud', 14),
(1013, 'Kfar Al Futouh', 14),
(1014, 'Khirbet Shaar', 14),
(1015, 'Kharayeb Al Jundi', 14),
(1016, 'Khatt Al Petrol', 14),
(1017, 'Douwayr Adawiya', 14),
(1018, 'Deir Janine', 14),
(1019, 'Deir Daloum', 14),
(1020, 'Dhouq Al Maksharin', 14),
(1021, 'Dhouq Al Hasniya', 14),
(1022, 'Dhouq Hadara', 14),
(1023, 'Rahba', 14),
(1024, 'Rammah', 14),
(1025, 'Safinat Al Drayb', 14),
(1026, 'Safinat Al Qaytaa', 14),
(1027, 'Sandyanat Raydan', 14),
(1028, 'Saysouq', 14),
(1029, 'Shan', 14),
(1030, 'Shadra', 14),
(1031, 'Sharbila', 14),
(1032, 'Dahr Al Qanbar', 14),
(1033, 'Dahr Al Leysina', 14),
(1034, 'Adbil', 14),
(1035, 'Aarqa', 14),
(1036, 'Akkar Al Atiqa', 14),
(1037, 'Ammar Al Baykat', 14),
(1038, 'Andqat', 14),
(1039, 'Ayat', 14),
(1040, 'Aydamoun', 14),
(1041, 'Sheikh Lar', 14),
(1042, 'Ain Al Thahab', 14),
(1043, 'Ain Al Zayt', 14),
(1044, 'Ain Yaqoub', 14),
(1045, 'Oyoun Al Ghazalan', 14),
(1046, 'Fasqin', 14),
(1047, 'Ain Ashma', 14),
(1048, 'Ain Tanta', 14),
(1049, 'Fneideq', 14),
(1050, 'Qabu Shamra', 14),
(1051, 'Qabeait', 14),
(1052, 'Qashlaq', 14),
(1053, 'Qinnaya', 14),
(1054, 'Karm Asfour', 14),
(1055, 'Beit Ghattas', 14),
(1056, 'Kurum Arab', 14),
(1057, 'Kfartoun', 14),
(1058, 'Kousha', 14),
(1059, 'Mar Touma', 14),
(1060, 'Majdala', 14),
(1061, 'Mazraat Balda', 14),
(1062, 'Mashta Hassan', 14),
(1063, 'Mashta Hammoud', 14),
(1064, 'Mashha', 14),
(1065, 'Mashmash', 14),
(1066, 'Mashlehat Al Hakour', 14),
(1067, 'Mamnaa', 14),
(1068, 'Mounjaz', 14),
(1069, 'Minyara', 14),
(1070, 'Haytla', 14),
(1071, 'Wadi Al Jamous', 14),
(1072, 'Wadi Al Hoor', 14),
(1073, 'Wadi Khaled', 14),
(1104, 'Ablah', 15),
(1105, 'Al Farzil', 15),
(1106, 'Al Marjiyat', 15),
(1107, 'Al Nasiriya', 15),
(1108, 'Al Nabi Ayla', 15),
(1109, 'Bar Elias', 15),
(1110, 'Bawarj', 15),
(1111, 'Terbol', 15),
(1112, 'Taalbaya', 15),
(1113, 'Jdita', 15),
(1114, 'Hazerta', 15),
(1115, 'Hay Al Fikani', 15),
(1116, 'Deir Al Ghazal', 15),
(1117, 'Rayat', 15),
(1118, 'Riyaq', 15),
(1119, 'Housh Hala', 15),
(1120, 'Zahle', 15),
(1121, 'Zahle - Maalaqa', 15),
(1122, 'Al Twayta', 15),
(1123, 'Al Karma', 15),
(1124, 'Taanayel', 15),
(1125, 'Saadnayel', 15),
(1126, 'Shtoura', 15),
(1127, 'Ali Al Nahri', 15),
(1128, 'Anjar', 15),
(1129, 'Housh Moussa', 15),
(1130, 'Ain Kfarzabad', 15),
(1131, 'Qaa Al Rimm', 15),
(1132, 'Qab Elias', 15),
(1133, 'Wadi Al Dalm', 15),
(1134, 'Qoussaya', 15),
(1135, 'Kfarzabad', 15),
(1136, 'Masa', 15),
(1137, 'Majdal Anjar', 15),
(1138, 'Maksah', 15),
(1139, 'Niha', 15),
(1140, 'Al Khayyara', 18),
(1141, 'Al Rawda', 18),
(1142, 'Al Sultan Yaqoub Al Muwahhada', 18),
(1143, 'Al Suwayri', 18),
(1144, 'Al Qaroun', 18),
(1145, 'Al Marj', 18),
(1146, 'Al Manara', 18),
(1147, 'Al Mansoura', 18),
(1148, 'Bab Mareh', 18),
(1149, 'Baaloul', 18),
(1150, 'Tall Dhanoub', 18),
(1151, 'Jab Janine', 18),
(1152, 'Housh Al Harayma', 18),
(1153, 'Khirbet Qanfar', 18),
(1154, 'Zalaya', 18),
(1155, 'Sahmar', 18),
(1156, 'Saghbeen', 18),
(1157, 'Aana', 18),
(1158, 'Ameeq', 18),
(1159, 'Aytanit', 18),
(1160, 'Ain Al Tineh', 18),
(1161, 'Ain Zibdeh', 18),
(1162, 'Ghaza', 18),
(1163, 'Qleya', 18),
(1164, 'Kamed Al Lawz', 18),
(1165, 'Kfarya', 18),
(1166, 'Lala', 18),
(1167, 'Labaya', 18),
(1168, 'Mashghara', 18),
(1169, 'Maydoun', 18),
(1170, 'Lousya', 18),
(1171, 'Yahmur', 18),
(1172, 'Al Bira', 27),
(1173, 'Al Housh', 27),
(1174, 'Al Rafid', 27),
(1175, 'Al Aqaba', 27),
(1176, 'Al Mahidsa', 27),
(1177, 'Baka', 27),
(1178, 'Bakfiya', 27),
(1179, 'Beit Lahya', 27),
(1180, 'Tannoura', 27),
(1181, 'Halwa', 27),
(1182, 'Khirbet Rouha', 27),
(1183, 'Deir Al Ashaer', 27),
(1184, 'Rashaya', 27),
(1185, 'Dahr Al Ahmar', 27),
(1186, 'Aita Al Fukhar', 27),
(1187, 'Ayha', 27),
(1188, 'Ain Harsha', 27),
(1189, 'Ain Al Arab', 27),
(1190, 'Ain Ata', 27),
(1191, 'Kfardinis', 27),
(1192, 'Kfarqouq', 27),
(1193, 'Mazraat Salsata', 27),
(1194, 'Kfarmashki', 27),
(1195, 'Koukba', 27),
(1196, 'Majdal Balhees', 27),
(1197, 'Madoukha', 27),
(1198, 'Yanta', 27),
(1199, 'Al Ansar', 16),
(1200, 'Al Tawfiqiya', 16),
(1201, 'Al Kharayeb', 16),
(1202, 'Al Khidr', 16),
(1203, 'Al Ram', 16),
(1204, 'Al Jibbaneh', 16),
(1205, 'Al Zarazir', 16),
(1206, 'Al Saideh', 16),
(1207, 'Al Taybeh', 16),
(1208, 'Al Ain', 16),
(1209, 'Al Fakkaha', 16),
(1210, 'Al Jadideh', 16),
(1211, 'Al Qaa', 16),
(1212, 'Al Qadam', 16),
(1213, 'Al Kaniseh', 16),
(1214, 'Al Libwa', 16),
(1215, 'Al Nabi Chit', 16),
(1216, 'Al Nabi Othman', 16),
(1217, 'Al Yammouneh', 16),
(1218, 'Ayat', 16),
(1219, 'Btadai', 16),
(1220, 'Badnayel', 16),
(1221, 'Barqa', 16),
(1222, 'Brital', 16),
(1223, 'Bshwat', 16),
(1224, 'Baalbek', 16),
(1225, 'Boudai', 16),
(1226, 'Al Allaq', 16),
(1227, 'Beit Mishik', 16),
(1228, 'Beit Mishik', 16),
(1229, 'Temnin Al Tahta', 16),
(1230, 'Temnin Al Faouqa', 16),
(1231, 'Jbaa', 16),
(1232, 'Jboula', 16),
(1233, 'Janta', 16),
(1234, 'Haddath Baalbek', 16),
(1235, 'Harbta', 16),
(1236, 'Hazine', 16),
(1237, 'Halbeta', 16),
(1238, 'Hour Taala', 16),
(1239, 'Housh Al Rafiqa', 16),
(1240, 'Housh Al Nabi', 16),
(1241, 'Housh Barada', 16),
(1242, 'Housh Tall Safiya', 16),
(1243, 'Housh Snide', 16),
(1244, 'Dours', 16),
(1245, 'Deir Al Ahmar', 16),
(1246, 'Ras Baalbek', 16),
(1247, 'Rammasa', 16),
(1248, 'Zaboud', 16),
(1249, 'Saraain Al Tahta', 16),
(1250, 'Saraain Al Faouqa', 16),
(1251, 'Shat', 16),
(1252, 'Shleifa', 16),
(1253, 'Shamstar Gharbi Baalbek', 16),
(1254, 'Kfardan', 16),
(1255, 'Tariya', 16),
(1256, 'Talyya', 16),
(1257, 'Arsal', 16),
(1258, 'Aynata', 16),
(1259, 'Fallawi', 16),
(1260, 'Qarha', 16),
(1261, 'Qsarnaba', 16),
(1262, 'Qald Al Saba', 16),
(1263, 'Qlayleh', 16),
(1264, 'Al Harfoush', 16),
(1265, 'Majdaloun', 16),
(1266, 'Mazraat Al Soueidan', 16),
(1267, 'Mazraat Al Toot', 16),
(1268, 'Masnaa Al Zahra', 16),
(1269, 'Maraboun', 16),
(1270, 'Maqraq', 16),
(1271, 'Maqneh', 16),
(1272, 'Nabha Al Damdoum', 16),
(1273, 'Nabha Al Mahafira', 16),
(1274, 'Nahla', 16),
(1275, 'Wadi Faghra', 16),
(1276, 'Younine', 16),
(1277, 'Al Sharbine', 17),
(1278, 'Al Shawagheer Al Faouqa', 17),
(1279, 'Al Shawagheer Al Tahta', 17),
(1280, 'Al Qasr', 17),
(1281, 'Al Kawakh', 17),
(1282, 'Al Hermel', 17),
(1283, 'Jouar Al Hasheesh', 17),
(1284, 'Fissane', 17),
(1285, 'Mazraat Sajad', 17),
(1286, 'Sidon', 23),
(1287, 'Arzay', 23),
(1288, 'Arkay', 23),
(1289, 'Al Babiliyeh', 23),
(1290, 'Al Barramieh', 23),
(1291, 'Al Bisariyeh', 23),
(1292, 'Al Hajjeh', 23),
(1293, 'Al Kharayeb', 23),
(1294, 'Al Zarariyeh', 23),
(1295, 'Al Siksikiyyeh', 23),
(1296, 'Al Salhiyeh', 23),
(1297, 'Al Sarafand', 23),
(1298, 'Al Adousiyyeh', 23),
(1299, 'Al Ghaziyeh', 23),
(1300, 'Al Ghassaniyeh', 23),
(1301, 'Al Qariyeh', 23),
(1302, 'Al Loubiyeh', 23),
(1303, 'Al Marwaniyeh', 23),
(1304, 'Al Mamariyeh', 23),
(1305, 'Al Miyyeh w Miyyeh', 23),
(1306, 'Al Najjariyeh', 23),
(1307, 'Al Hilaliyeh', 23),
(1308, 'Ansariyeh', 23),
(1309, 'Barti', 23),
(1310, 'Bqasta', 23),
(1311, 'Bnaafoul', 23),
(1312, 'Tfahhta', 23),
(1313, 'Harat Sidon', 23),
(1314, 'Khartoum', 23),
(1315, 'Darb Al Seem', 23),
(1316, 'Zayta', 23),
(1317, 'Tabaya', 23),
(1318, 'Tanbourit', 23),
(1319, 'Abra', 23),
(1320, 'Adloun', 23),
(1321, 'Aqtanit', 23),
(1322, 'Anqoun', 23),
(1323, 'Ain Al Dalb', 23),
(1324, 'Qaqaiyat Al Snoubar', 23),
(1325, 'Qannarit', 23),
(1326, 'Kfaryet', 23),
(1327, 'Kfarhatta', 23),
(1328, 'Kfarshallal', 23),
(1329, 'Kfarmalki', 23),
(1330, 'Kawthariyet Al Sayyad', 23),
(1331, 'Majdalyoune', 23),
(1332, 'Maghdousheh', 23),
(1333, 'Arzoun', 24),
(1334, 'Al Bazouriyeh', 24),
(1335, 'Al Barghaliyeh', 24),
(1336, 'Al Bustan', 24),
(1337, 'Al Bayyadh', 24),
(1338, 'Al Jebbayn', 24),
(1339, 'Al Haloussiyeh', 24),
(1340, 'Al Humairi', 24),
(1341, 'Al Haniyeh', 24),
(1342, 'Al Rammadiyeh', 24),
(1343, 'Al Zaloutieh', 24),
(1344, 'Al Shaatiyyeh', 24),
(1345, 'Al Malikiyeh', 24),
(1346, 'Al Shihabiyeh', 24),
(1347, 'Al Dhahira', 24),
(1348, 'Al Abbasiyeh', 24),
(1349, 'Al Qalileh', 24),
(1350, 'Al Kaniseh', 24),
(1351, 'Al Majadel', 24),
(1352, 'Al Mansouri', 24),
(1353, 'Al Naqoura', 24),
(1354, 'Al Nafakhiyeh', 24),
(1355, 'Batouliyeh', 24),
(1356, 'Barish', 24),
(1357, 'Bafleyh', 24),
(1358, 'Bedyas', 24),
(1359, 'Burj Al Shamali', 24),
(1360, 'Burj Rahal', 24),
(1361, 'Ain Abou Abdullah', 24),
(1362, 'Ain Al Zarqa', 24),
(1363, 'Jibal Al Batm', 24),
(1364, 'Jennata', 24),
(1365, 'Jwayya', 24),
(1366, 'Hanawiya', 24),
(1367, 'Dabaal', 24),
(1368, 'Dardaghiya', 24),
(1369, 'Deir Aames', 24),
(1370, 'Deir Qanoun Al Nahr', 24),
(1371, 'Deir Qanoun Ras Al Ain', 24),
(1372, 'Deir Kifa', 24),
(1373, 'Rashknaniyeh', 24),
(1374, 'Zibqine', 24),
(1375, 'Salaa', 24),
(1376, 'Shahour', 24),
(1377, 'Shamaa', 24),
(1378, 'Shiheen', 24),
(1379, 'Sadiqayn', 24),
(1380, 'Srifa', 24),
(1381, 'Tyre', 24),
(1382, 'Toura', 24),
(1383, 'Tayr Harfa', 24),
(1384, 'Tayr Daba', 24),
(1385, 'Tayr Falsieh', 24),
(1386, 'Alma Al Shaab', 24),
(1387, 'Aitit', 24),
(1388, 'Ain Baal', 24),
(1389, 'Qana', 24),
(1390, 'Majdalzoun', 24),
(1391, 'Mahrouneh', 24),
(1392, 'Marwahin', 24),
(1393, 'Mazraat Msharaf', 24),
(1394, 'Maaraka', 24),
(1395, 'Maroub', 24),
(1396, 'Yarine', 24),
(1397, 'Yanouh', 24),
(1398, 'Arnoun', 19),
(1399, 'Al Doueir', 19),
(1400, 'Al Sharqiyyeh', 19),
(1401, 'Al Qasaybeh', 19),
(1402, 'Al Kfour', 19),
(1403, 'Al Nabatiyeh Al Tahta', 19),
(1404, 'Al Nabatiyeh Al Faouqa', 19),
(1405, 'Al Numairiyyeh', 19),
(1406, 'Ansar', 19),
(1407, 'Brayqa', 19),
(1408, 'Jbaa', 19),
(1409, 'Ain Bouswar', 19),
(1410, 'Jebchit', 19),
(1411, 'Jarjouh', 19),
(1412, 'Harouf', 19),
(1413, 'Haboush', 19),
(1414, 'Houmine Al Tahta', 19),
(1415, 'Houmine Al Faouqa', 19),
(1416, 'Deir Al Zahrani', 19),
(1417, 'Roumine', 19),
(1418, 'Zabdine', 19),
(1419, 'Zifta', 19),
(1420, 'Zoutar Al Sharqiyyeh', 19),
(1421, 'Zoutar Al Gharbiyyeh', 19),
(1422, 'Sayni', 19),
(1423, 'Shoukeen', 19),
(1424, 'Sarba', 19),
(1425, 'Seer Al Gharbiyyeh', 19),
(1426, 'Aaba', 19),
(1427, 'Adshit', 19),
(1428, 'Arabsalim', 19),
(1429, 'Azzeh', 19),
(1430, 'Ain Qana', 19),
(1431, 'Qaqaiyat Al Jisr', 19),
(1432, 'Kfartebnit', 19),
(1433, 'Kfarrouman', 19),
(1434, 'Kfarseer', 19),
(1435, 'Kfarfila', 19),
(1436, 'Mayfdoun', 19),
(1437, 'Yahmour', 19),
(1438, 'Al Khalawat', 20),
(1439, 'Al Dallafeh', 20),
(1440, 'Al Fardays', 20),
(1441, 'Al Kfeir', 20),
(1442, 'Al Mari', 20),
(1443, 'Al Majidiyyeh', 20),
(1444, 'Al Habbariyeh', 20),
(1445, 'Hasbaya', 20),
(1446, 'Rashaya Al Fukhar', 20),
(1447, 'Shebaa', 20),
(1448, 'Shwayya', 20),
(1449, 'Ain Qinya', 20),
(1450, 'Kfar Hammam', 20),
(1451, 'Kfar Shouba', 20),
(1452, 'Koukba', 20),
(1453, 'Marj Al Zuhour', 20),
(1454, 'Mims', 20),
(1455, 'Al Jumayjmeh', 22),
(1456, 'Al Saltaniyeh', 22),
(1457, 'Al Tayri', 22),
(1458, 'Al Ghandouriyeh', 22),
(1459, 'Al Qawzah', 22),
(1460, 'Burj Qallawiyeh', 22),
(1461, 'Braasheet', 22),
(1462, 'Bint Jbeil', 22),
(1463, 'Beit Leef', 22),
(1464, 'Beit Yahoun', 22),
(1465, 'Tebnine', 22),
(1466, 'Harees', 22),
(1467, 'Hanine', 22),
(1468, 'Haddatha', 22),
(1469, 'Khirbet Selm', 22),
(1470, 'Dibil', 22),
(1471, 'Deir Antar', 22),
(1472, 'Ramiyeh', 22),
(1473, 'Rashaf', 22),
(1474, 'Rmeish', 22),
(1475, 'Shaqra', 22),
(1476, 'Doubiyeh', 22),
(1477, 'Sarbine', 22),
(1478, 'Safad Al Batteekh', 22),
(1479, 'Aita Al Jabal', 22),
(1480, 'Aita Al Shaab', 22),
(1481, 'Aytaroun', 22),
(1482, 'Ain Ebel', 22),
(1483, 'Aynata', 22),
(1484, 'Faroun', 22),
(1485, 'Qallawiyeh', 22),
(1486, 'Kafra', 22),
(1487, 'Kfardounine', 22),
(1488, 'Kounine', 22),
(1489, 'Maroun Al Ras', 22),
(1490, 'Yaroun', 22),
(1491, 'Yater', 22),
(1492, 'Aabel Al Saqi', 21),
(1493, 'Al Khiam', 21),
(1494, 'Al Sawana', 21),
(1495, 'Al Taybeh', 21),
(1496, 'Al Qalaiya', 21),
(1497, 'Al Qantara', 21),
(1498, 'Al Wazzani', 21),
(1499, 'Burj Al Mulouk', 21),
(1500, 'Ballat', 21),
(1501, 'Blayda', 21),
(1502, 'Bani Hayyan', 21),
(1503, 'Touline', 21),
(1504, 'Jadidet Marjaayoun', 21),
(1505, 'Houla', 21),
(1506, 'Dibbine', 21),
(1507, 'Deir Siryan', 21),
(1508, 'Deir Mimas', 21),
(1509, 'Rab Thalatheen', 21),
(1510, 'Talouseh', 21),
(1511, 'Adshit', 21),
(1512, 'Adayseh', 21),
(1513, 'Qabrikha', 21),
(1514, 'Kfarkila', 21),
(1515, 'Majdal Al Selm', 21),
(1516, 'Markaba', 21),
(1517, 'Meiss Al Jabal', 21);

-- --------------------------------------------------------

--
-- Table structure for table `voted`
--

DROP TABLE IF EXISTS `voted`;
CREATE TABLE IF NOT EXISTS `voted` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `election_id` int NOT NULL,
  `vote_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `election_id` (`election_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
CREATE TABLE IF NOT EXISTS `votes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `election_id` int NOT NULL,
  `list_id` int DEFAULT NULL,
  `candidate_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `election_id` (`election_id`),
  KEY `list_id` (`list_id`),
  KEY `candidate_id` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `winner_candidates`
--

DROP TABLE IF EXISTS `winner_candidates`;
CREATE TABLE IF NOT EXISTS `winner_candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `election_id` int DEFAULT NULL,
  `candidate_id` int DEFAULT NULL,
  `list_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `election_id` (`election_id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `list_id` (`list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `winner_lists`
--

DROP TABLE IF EXISTS `winner_lists`;
CREATE TABLE IF NOT EXISTS `winner_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `election_id` int DEFAULT NULL,
  `list_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `election_id` (`election_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_users`
--
ALTER TABLE `auth_users`
  ADD CONSTRAINT `auth_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `candidates_ibfk_2` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `candidates_ibfk_3` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `constituencies`
--
ALTER TABLE `constituencies`
  ADD CONSTRAINT `constituencies_ibfk_1` FOREIGN KEY (`governorate_id`) REFERENCES `governorates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `denominations`
--
ALTER TABLE `denominations`
  ADD CONSTRAINT `denominations_ibfk_1` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`governorate_id`) REFERENCES `governorates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parliament_members`
--
ALTER TABLE `parliament_members`
  ADD CONSTRAINT `parliament_members_ibfk_1` FOREIGN KEY (`parliament_id`) REFERENCES `parliaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `parliament_members_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `speaker_of_parliament`
--
ALTER TABLE `speaker_of_parliament`
  ADD CONSTRAINT `speaker_of_parliament_ibfk_1` FOREIGN KEY (`parliament_id`) REFERENCES `parliaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `speaker_of_parliament_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`governorate_id`) REFERENCES `governorates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`village_id`) REFERENCES `villages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`marital_status_id`) REFERENCES `marital_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_6` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_7` FOREIGN KEY (`denomination_id`) REFERENCES `denominations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_8` FOREIGN KEY (`father_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_ibfk_9` FOREIGN KEY (`mother_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `villages`
--
ALTER TABLE `villages`
  ADD CONSTRAINT `villages_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `voted`
--
ALTER TABLE `voted`
  ADD CONSTRAINT `voted_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `voted_ibfk_2` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `winner_candidates`
--
ALTER TABLE `winner_candidates`
  ADD CONSTRAINT `winner_candidates_ibfk_1` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `winner_candidates_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `winner_candidates_ibfk_3` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `winner_lists`
--
ALTER TABLE `winner_lists`
  ADD CONSTRAINT `winner_lists_ibfk_1` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
