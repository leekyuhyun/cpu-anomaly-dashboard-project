import pandas as pd
import glob
import os

# 원본 CSV 파일이 있는 폴더
SOURCE_DIR = "data/originals"
# 병합된 CSV 파일을 저장할 경로 (init_db.py가 참조하는 경로)
OUTPUT_PATH = "data/cpu_data.csv"
# 병합된 파일이 저장될 폴더 (data/)
OUTPUT_DIR = os.path.dirname(OUTPUT_PATH)

def merge_csv_files():
    """
    SOURCE_DIR 안의 모든 csv 파일을 읽어 
    하나의 DataFrame으로 병합하고 OUTPUT_PATH에 저장합니다.
    """
    csv_files = glob.glob(os.path.join(SOURCE_DIR, "*.csv"))
    
    if not csv_files:
        print(f"No CSV files found in {SOURCE_DIR}")
        return

    print(f"Found {len(csv_files)} files. Merging...")

    # 모든 CSV를 읽어 리스트에 저장
    df_list = []
    for file in csv_files:
        try:
            df_list.append(pd.read_csv(file))
        except Exception as e:
            print(f"Error reading {file}: {e}")
            
    # 모든 DataFrame 병합
    merged_df = pd.concat(df_list, ignore_index=True)

    # (중요) init_db.py가 'timestamp' 컬럼을 사용하므로, 
    # 데이터를 시간순으로 정렬합니다.
    if 'timestamp' in merged_df.columns:
        merged_df['timestamp'] = pd.to_datetime(merged_df['timestamp'])
        merged_df = merged_df.sort_values(by='timestamp')
    else:
        print("Warning: 'timestamp' column not found. Data not sorted.")
        
    # 출력 폴더 (data/)가 없으면 생성
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 병합된 파일 저장
    merged_df.to_csv(OUTPUT_PATH, index=False)
    
    print(f"Successfully merged {len(csv_files)} files into {OUTPUT_PATH}")
    print(f"Total rows: {len(merged_df)}")

if __name__ == "__main__":
    merge_csv_files()