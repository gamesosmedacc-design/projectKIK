import math

def haversine_formula(data_latitude, data_longitude):
        school_latitude_1 = -2.7642786848538408
        school_longitude_1 = 115.26435013484924

        school_latitude_2 = -2.7636306947603866
        school_longitude_2 = 115.26379405844274

        school_latitude_3 = -2.7630683719681604
        school_longitude_3 = 115.2630044434663
        earth_radius = 6371000

        center_latitude_radians_1 = school_latitude_1 * math.pi / 180
        center_longitude_radians_1 = school_longitude_1 * math.pi / 180

        center_latitude_radians_2 = school_latitude_2 * math.pi / 180
        center_longitude_radians_2 = school_longitude_2 * math.pi / 180

        center_latitude_radians_3 = school_latitude_3 * math.pi / 180
        center_longitude_radians_3 = school_longitude_3 * math.pi / 180

        user_latitude_radians = data_latitude * math.pi / 180
        user_longitude_radians = data_longitude * math.pi / 180

        delta_lat_1 = center_latitude_radians_1 - user_latitude_radians
        delta_long_1 = center_longitude_radians_1 - user_longitude_radians

        delta_lat_2 = center_latitude_radians_2 - user_latitude_radians
        delta_long_2 = center_longitude_radians_2 - user_longitude_radians

        delta_lat_3 = center_latitude_radians_3 - user_latitude_radians
        delta_long_3 = center_longitude_radians_3 - user_longitude_radians

        calculate_1 = (math.sin(delta_lat_1 / 2) ** 2 + math.cos(center_latitude_radians_1) * math.cos(user_latitude_radians) * math.sin(delta_long_1 / 2) ** 2)

        calculate_2 = (math.sin(delta_lat_2 / 2) ** 2 + math.cos(center_latitude_radians_2) * math.cos(user_latitude_radians) * math.sin(delta_long_2 / 2) ** 2)

        calculate_3 = (math.sin(delta_lat_3 / 2) ** 2 + math.cos(center_latitude_radians_3) * math.cos(user_latitude_radians) * math.sin(delta_long_3 / 2) ** 2)

        distance_angle_1 = 2 * math.atan2(math.sqrt(calculate_1), math.sqrt(1 - calculate_1))
        last_distance_1 = earth_radius * distance_angle_1

        distance_angle_2 = 2 * math.atan2(math.sqrt(calculate_2), math.sqrt(1 - calculate_2))
        last_distance_2 = earth_radius * distance_angle_2

        distance_angle_3 = 2 * math.atan2(math.sqrt(calculate_3), math.sqrt(1 - calculate_3))
        last_distance_3 = earth_radius * distance_angle_3

        check_distance_1 = last_distance_1 <= 60
        check_distance_2 = last_distance_2 <= 60
        check_distance_3 = last_distance_3 <= 60

        return check_distance_1, check_distance_2, check_distance_3

# now = datetime.now()
# current_time = now.time()
# print(current_time)
# set_time_late = datetime.strptime("08:00:00", "%H:%M:%S").time()
# print(set_time_late)

# if current_time < set_time_late:
#         print("kamu terlambat")